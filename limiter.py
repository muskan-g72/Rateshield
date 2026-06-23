from fastapi import HTTPException
from redis_client import redis_client
from database import SessionLocal
from models import User
import time

WINDOW = 60

PLAN_LIMITS = {
    "free": 100000,
    "pro": 100000
}


def check_rate_limit(data):


    api_key = data["api_key"]
    user_id = data["user_id"]
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

        # Remove requests older than WINDOW seconds
        redis_client.zremrangebyscore(
            redis_key,
            0,
            window_start
        )

        # Count requests in current window
        current_count = redis_client.zcard(redis_key)

        if current_count >= limit:
            redis_client.incr(f"stats:user:{user_id}:blocked")
            raise HTTPException(
                status_code=429,
                detail=f"{user.plan} plan limit exceeded"
            )

        # Add current request timestamp
        redis_client.zadd(
            redis_key,
            {str(current_time): current_time}
        )

        redis_client.expire(
            redis_key,
            WINDOW
        )

        redis_client.incr(f"stats:user:{user_id}:approved")

    finally:
        db.close()