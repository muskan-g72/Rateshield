from fastapi import HTTPException
from redis_client import redis_client
from database import SessionLocal
from models import User

WINDOW = 60

PLAN_LIMITS = {
    "free": 5,
    "pro": 50
}

def check_rate_limit(data):
    redis_client.incr("total_requests")

    api_key = data["api_key"]
    user_id = data["user_id"]

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

    finally:
        db.close()

    redis_key = f"rate:{api_key}"

    count = redis_client.incr(redis_key)

    if count == 1:
        redis_client.expire(redis_key, WINDOW)

    if count > limit:
        redis_client.incr("blocked_requests")

        raise HTTPException(
            status_code=429,
            detail=f"{user.plan} plan limit exceeded"
        )

    redis_client.incr("approved_requests")