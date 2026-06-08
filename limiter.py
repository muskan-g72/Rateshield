from fastapi import HTTPException
from redis_client import redis_client
from database import SessionLocal
from models import User

WINDOW = 60

def check_rate_limit(data):
    redis_client.incr("total_requests")
    api_key = data["api_key"]
    user_id = data["user_id"]
    db = SessionLocal()
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if user.plan == "pro":
        limit = 100
    else:
        limit = 5
    redis_key = f"rate:{api_key}"
    current_count = redis_client.get(redis_key)
    if current_count is None:
        redis_client.set(
            redis_key,
            1,
            ex=WINDOW
        )
        redis_client.incr("approved_requests")
        return

    current_count = int(current_count)
    if current_count >= limit:
        redis_client.incr("blocked_requests")
        raise HTTPException(
            status_code=429,
            detail=f"{user.plan} plan limit exceeded"
        )
    redis_client.incr(redis_key)
    redis_client.incr("approved_requests")
