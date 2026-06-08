from fastapi import Header, HTTPException
from database import SessionLocal
from models import APIKey


def validate_api_key(
    x_api_key: str = Header(...)
):
    db = SessionLocal()
    key = (
        db.query(APIKey)
        .filter(APIKey.api_key == x_api_key)
        .first()
    )
    if not key:
        raise HTTPException(
            status_code=401,
            detail="Invalid API Key"
        )
    return {
    "api_key": key.api_key,
    "user_id": key.user_id
}
