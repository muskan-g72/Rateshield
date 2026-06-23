from fastapi import Header, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from key_security import hash_api_key
from models import APIKey


def validate_api_key(
    x_api_key: str = Header(...)
):
    db: Session = SessionLocal()

    try:
        hashed_key = hash_api_key(x_api_key)

        key = (
            db.query(APIKey)
            .filter(
                APIKey.key_hash == hashed_key,
                APIKey.active == True
            )
            .first()
        )

        if not key:
            raise HTTPException(
                status_code=401,
                detail="Invalid API Key"
            )

        return {
            "api_key": x_api_key,
            "user_id": key.user_id
        }

    finally:
        db.close()