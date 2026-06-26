from fastapi import HTTPException
from redis_client import redis_client
from database import SessionLocal
from models import User
import time

WINDOW = 60  # seconds

PLAN_LIMITS = {
    "free": 5,
    "pro": 100,
}

# ---------------------------
# LUA SCRIPT (ATOMIC LIMITER)
# ---------------------------
RATE_LIMIT_LUA = """
local key = KEYS[1]

local limit = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local now = tonumber(ARGV[3])

-- remove expired requests
redis.call("ZREMRANGEBYSCORE", key, 0, now - window)

-- count requests
local count = redis.call("ZCARD", key)

-- reject if limit exceeded
if count >= limit then
    return 0
end

-- accept request
redis.call("ZADD", key, now, now)
redis.call("EXPIRE", key, window)

return 1
"""

rate_limit_script = redis_client.register_script(RATE_LIMIT_LUA)


# ---------------------------
# RATE LIMIT FUNCTION
# ---------------------------
def check_rate_limit(data):
    api_key = data["api_key"]
    user_id = data["user_id"]

    db = SessionLocal()

    try:
        # ---------------------------
        # USER FETCH
        # ---------------------------
        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            raise HTTPException(
                status_code=401,
                detail="User not found"
            )

        limit = PLAN_LIMITS.get(user.plan, 5)

        redis_key = f"rate:{api_key}"
        current_time = time.time()

        # ---------------------------
        # ANALYTICS (KEEP IN PYTHON)
        # ---------------------------
        redis_client.incr("total_requests")
        redis_client.incr(f"stats:user:{user_id}:total")

        # ---------------------------
        # ATOMIC LUA RATE LIMIT CHECK
        # ---------------------------
        allowed = rate_limit_script(
            keys=[redis_key],
            args=[limit, WINDOW, current_time]
        )

        if not allowed:
            redis_client.incr("blocked_requests")
            redis_client.incr(f"stats:user:{user_id}:blocked")

            raise HTTPException(
                status_code=429,
                detail=f"{user.plan} plan limit exceeded",
                headers={
                    "Retry-After": str(WINDOW)
                }
            )

        # ---------------------------
        # SUCCESS PATH
        # ---------------------------
        redis_client.incr("approved_requests")
        redis_client.incr(f"stats:user:{user_id}:approved")

    finally:
        db.close()