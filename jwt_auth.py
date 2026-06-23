from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from database import SessionLocal
from models import User
from security import verify_token

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    email = verify_token(token)

    db = SessionLocal()

    user = db.query(User).filter(
        User.email == email
    ).first()


    if user is None:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user