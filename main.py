from datetime import datetime
import httpx
import models
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from auth import validate_api_key
from database import Base, SessionLocal, engine, get_db
from jwt_auth import get_current_user
from key_security import generate_api_key, hash_api_key
from limiter import check_rate_limit
from models import APIKey, User
from redis_client import redis_client
from schemas import UserLogin, UserRegister
from security import (
    create_access_token,
    hash_password,
    verify_password,
)
from schemas import APIKeyCreate

app = FastAPI(
    title="RateShield API Gateway",
    version="1.0.0",
    description=(
        "Production-style API Gateway featuring JWT authentication, "
        "API key management, Redis-backed sliding-window rate limiting, "
        "request routing, and developer analytics."
    ),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:8080",
        "http://localhost:8080",
        "http://127.0.0.1:5500",
        "http://localhost:5500",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


@app.get("/")
def home():
    return {
        "message": "RateShield Running"
    }


@app.post("/register")
def register(user: UserRegister):
    db = SessionLocal()

    hashed = hash_password(user.password)

    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hashed
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User created",
        "user_id": new_user.id
    }


@app.post("/login")
def login(user: UserLogin):
    db = SessionLocal()

    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not db_user:
        return {
            "message": "Invalid email or password"
        }

    if not verify_password(
        user.password,
        db_user.hashed_password
    ):
        return {
            "message": "Invalid email or password"
        }

    token = create_access_token(
        {
            "sub": db_user.email
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@app.post("/upgrade")
def upgrade(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    db_user = db.query(User).filter(
        User.id == current_user.id
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    db_user.plan = "pro"

    db.commit()
    db.refresh(db_user)

    return {
        "message": "Plan upgraded successfully",
        "plan": db_user.plan
    }


@app.post("/generate-key")
def generate_key(
    key_data: APIKeyCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    raw_key = generate_api_key()
    hashed_key = hash_api_key(raw_key)

    api_key = APIKey(
        user_id=current_user.id,
        key_hash=hashed_key,
        name=key_data.name,
        active=True,
        created_at=datetime.utcnow()
    )

    db.add(api_key)
    db.commit()
    db.refresh(api_key)

    return {
        "api_key": raw_key,
        "name": api_key.name
    }

@app.get("/api-keys")
def list_api_keys(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    keys = (
        db.query(APIKey)
        .filter(APIKey.user_id == current_user.id)
        .all()
    )

    return [
        {
            "id": key.id,
            "name": key.name,
            "active": key.active,
            "created_at": key.created_at
        }
        for key in keys
    ]

@app.delete("/api-key/{key_id}")
def revoke_api_key(
    key_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    key = (
        db.query(APIKey)
        .filter(
            APIKey.id == key_id,
            APIKey.user_id == current_user.id
        )
        .first()
    )

    if not key:
        raise HTTPException(
            status_code=404,
            detail="API Key not found"
        )

    key.active = False

    db.commit()

    return {
        "message": "API Key revoked successfully"
    }

@app.get("/protected")
def protected_route(
    data=Depends(validate_api_key)
):
    check_rate_limit(data)

    return {
        "message": "Access Granted"
    }


@app.get("/gateway/weather")
async def weather_gateway(
    api_key=Depends(validate_api_key)
):

    check_rate_limit(api_key)

    async with httpx.AsyncClient() as client:
        response = await client.get(
            "http://weather-service:8001/weather"
        )

    return response.json()


@app.get("/stats")
def stats():

    total = int(redis_client.get("total_requests") or 0)
    approved = int(redis_client.get("approved_requests") or 0)
    blocked = int(redis_client.get("blocked_requests") or 0)

    success_rate = 0

    if total > 0:
        success_rate = round(
            (approved / total) * 100,
            2
        )

    return {
        "total_requests": total,
        "approved_requests": approved,
        "blocked_requests": blocked,
        "success_rate": f"{success_rate}%"
    }

@app.get("/dashboard")
def dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    total_api_keys = db.query(APIKey).filter(
        APIKey.user_id == current_user.id
    ).count()

    active_api_keys = db.query(APIKey).filter(
        APIKey.user_id == current_user.id,
        APIKey.active == True
    ).count()

    total_requests = int(
        redis_client.get(f"stats:user:{current_user.id}:total") or 0
    )

    approved_requests = int(
        redis_client.get(f"stats:user:{current_user.id}:approved") or 0
    )

    blocked_requests = int(
        redis_client.get(f"stats:user:{current_user.id}:blocked") or 0
    )

    success_rate = 0
    if total_requests > 0:
        success_rate = round(
            (approved_requests / total_requests) * 100,
            2
        )

    return {
        "name": current_user.name,
        "email": current_user.email,
        "plan": current_user.plan,

        "total_api_keys": total_api_keys,
        "active_api_keys": active_api_keys,

        "total_requests": total_requests,
        "approved_requests": approved_requests,
        "blocked_requests": blocked_requests,

        "success_rate": f"{success_rate}%"
    }