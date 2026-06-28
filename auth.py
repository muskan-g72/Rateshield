from sqlalchemy.orm import Session
from fastapi import Header, HTTPException, Request
from database import SessionLocal
from key_security import hash_api_key
from models import APIKey


def validate_api_key(
    request: Request,
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

        # validate FIRST
        if not key:
            raise HTTPException(
                status_code=401,
                detail="Invalid API Key"
            )

        # attach context AFTER validation
        request.state.user_id = key.user_id
        request.state.api_key = x_api_key
        request.state.api_key_id = key.id

        return {
            "api_key": x_api_key,
            "user_id": key.user_id
        }

    finally:
        db.close()