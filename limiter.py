from fastapi import HTTPException
from redis.exceptions import ResponseError
from redis_client import redis_client
from database import SessionLocal
from models import User
import time

WINDOW = 60  # seconds

PLAN_LIMITS = {
    "free": 5,
    "pro": 100,
}

# -----------------------------
# Atomic Lua rate limiter
# -----------------------------
RATE_LIMIT_LUA = """
local key = KEYS[1]

local limit = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local now = tonumber(ARGV[3])

redis.call("ZREMRANGEBYSCORE", key, 0, now - window)

local count = redis.call("ZCARD", key)

if count >= limit then
    return 0
end

redis.call("ZADD", key, now, now)
redis.call("EXPIRE", key, window)

return 1
"""

_rate_limit_script = None


def get_rate_limit_script():
    global _rate_limit_script

    if _rate_limit_script is None:
        _rate_limit_script = redis_client.register_script(RATE_LIMIT_LUA)

    return _rate_limit_script


def check_rate_limit(data):
    api_key = data["api_key"]
    user_id = data["user_id"]

    db = SessionLocal()

    try:
        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            raise HTTPException(
                status_code=401,
                detail="User not found"
            )

        limit = PLAN_LIMITS.get(user.plan, 5)
        redis_key = f"rate:{api_key}"
        current_time = time.time()

        # Analytics
        redis_client.incr("total_requests")
        redis_client.incr(f"stats:user:{user_id}:total")

        # -----------------------------
        # Try Lua (Production)
        # -----------------------------
        try:
            allowed = get_rate_limit_script()(
                keys=[redis_key],
                args=[limit, WINDOW, current_time]
            )

        # -----------------------------
        # FakeRedis fallback (Tests)
        # -----------------------------
        except ResponseError:
            redis_client.zremrangebyscore(
                redis_key,
                0,
                current_time - WINDOW
            )

            count = redis_client.zcard(redis_key)

            if count >= limit:
                allowed = 0
            else:
                redis_client.zadd(
                    redis_key,
                    {current_time: current_time}
                )
                redis_client.expire(redis_key, WINDOW)
                allowed = 1

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

        redis_client.incr("approved_requests")
        redis_client.incr(f"stats:user:{user_id}:approved")

    finally:
        db.close()