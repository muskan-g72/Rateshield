from fastapi import HTTPException
from redis_client import redis_client
from database import SessionLocal
from models import User
import time

WINDOW = 60  # seconds

PLAN_LIMITS = {
    "free": 5,
    "pro": 100
}

def check_rate_limit(data):
    api_key = data["api_key"]
    user_id = data["user_id"]

    # Global analytics
    redis_client.incr("total_requests")

    # User analytics
    redis_client.incr(f"stats:user:{user_id}:total")

    db = SessionLocal()

    try:
        user = db.query(User).filter(
            User.id == user_id
        ).first()

        if not user:
            raise HTTPException(
                status_code=401,
                detail="User not found"
            )

        limit = PLAN_LIMITS.get(user.plan, 5)

        redis_key = f"rate:{api_key}"

        current_time = time.time()
        window_start = current_time - WINDOW

        # Remove expired requests
        redis_client.zremrangebyscore(
            redis_key,
            0,
            window_start
        )

        current_count = redis_client.zcard(redis_key)

        # Rate limit exceeded
        if current_count >= limit:

            # Global analytics
            redis_client.incr("blocked_requests")

            # User analytics
            redis_client.incr(
                f"stats:user:{user_id}:blocked"
            )

            # Find the oldest request in the sliding window
            oldest_request = redis_client.zrange(
                redis_key,
                0,
                0,
                withscores=True
            )

            retry_after = WINDOW

            if oldest_request:
                oldest_timestamp = oldest_request[0][1]

                retry_after = max(
                    1,
                    int(WINDOW - (current_time - oldest_timestamp))
                )

            raise HTTPException(
                status_code=429,
                detail=f"{user.plan} plan limit exceeded",
                headers={
                    "Retry-After": str(retry_after)
                }
            )

        # Store current request timestamp
        redis_client.zadd(
            redis_key,
            {str(current_time): current_time}
        )

        redis_client.expire(
            redis_key,
            WINDOW
        )

        # Global analytics
        redis_client.incr("approved_requests")

        # User analytics
        redis_client.incr(
            f"stats:user:{user_id}:approved"
        )

    finally:
        db.close()