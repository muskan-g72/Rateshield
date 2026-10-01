import logging
import time
from fastapi import HTTPException
from redis.exceptions import ResponseError, RedisError, ConnectionError, TimeoutError
import redis_client
from database import SessionLocal
from models import User
from settings import settings

logger = logging.getLogger(__name__)

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


def get_rate_limit_script(client):
    global _rate_limit_script

    if _rate_limit_script is None:
        _rate_limit_script = client.register_script(RATE_LIMIT_LUA)

    return _rate_limit_script


def check_rate_limit(data):
    api_key = data["api_key"]
    user_id = data["user_id"]

    client = redis_client.redis_client
    if client is None:
        logger.error("Redis client is not configured or unavailable")
        if settings.FAIL_OPEN:
            logger.warning("FAIL_OPEN is True: allowing request despite missing Redis client")
            return
        raise HTTPException(
            status_code=503,
            detail={"error": "rate_limiter_unavailable", "message": "The rate limiter (Redis) is unavailable. Check system health."},
        )

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

        try:
            # Analytics
            client.incr("total_requests")
            client.incr(f"stats:user:{user_id}:total")

            # -----------------------------
            # Try Lua (Production)
            # -----------------------------
            try:
                allowed = get_rate_limit_script(client)(
                    keys=[redis_key],
                    args=[limit, WINDOW, current_time]
                )

            # -----------------------------
            # FakeRedis fallback (Tests)
            # -----------------------------
            except ResponseError:
                client.zremrangebyscore(
                    redis_key,
                    0,
                    current_time - WINDOW
                )

                count = client.zcard(redis_key)

                if count >= limit:
                    allowed = 0
                else:
                    client.zadd(
                        redis_key,
                        {current_time: current_time}
                    )
                    client.expire(redis_key, WINDOW)
                    allowed = 1

            if not allowed:
                client.incr("blocked_requests")
                client.incr(f"stats:user:{user_id}:blocked")

                raise HTTPException(
                    status_code=429,
                    detail=f"{user.plan} plan limit exceeded",
                    headers={
                        "Retry-After": str(WINDOW)
                    }
                )

            client.incr("approved_requests")
            client.incr(f"stats:user:{user_id}:approved")

        except HTTPException:
            raise
        except (RedisError, ConnectionError, TimeoutError, OSError) as redis_err:
            logger.error(f"Redis rate limiting failure: {type(redis_err).__name__} - {redis_err}", exc_info=True)
            if settings.FAIL_OPEN:
                logger.warning("FAIL_OPEN is True: allowing request despite Redis error")
                return
            raise HTTPException(
                status_code=503,
                detail={"error": "rate_limiter_unavailable", "message": "The rate limiter (Redis) is unavailable. Check system health."},
            )

    finally:
        db.close()