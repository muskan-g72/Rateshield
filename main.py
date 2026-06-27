from datetime import datetime

import httpx
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.orm import Session

from database import get_db, engine
from guards import api_key_guard, jwt_guard
from key_security import generate_api_key, hash_api_key
from models import APIKey, User
import redis_client
from schemas import APIKeyCreate, UserLogin, UserRegister
from security import create_access_token, hash_password, verify_password


app = FastAPI(
    title="RateShield API Gateway",
    version="1.0.0",
    description=(
        "Production-style API Gateway featuring JWT authentication, "
        "API key management, Redis-backed rate limiting, "
        "request routing, and analytics."
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


@app.get("/")
def home():
    return {"message": "RateShield Running"}


@app.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User created",
        "user_id": new_user.id
    }


@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or not verify_password(
        user.password,
        db_user.hashed_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token({"sub": db_user.email})

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@app.post("/upgrade")
def upgrade(
    current_user: User = Depends(jwt_guard),
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


@app.post("/api-keys")
def create_api_key(
    key_data: APIKeyCreate,
    current_user: User = Depends(jwt_guard),
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
        "id": int(api_key.id),
        "api_key": raw_key,
        "name": api_key.name,
        "active": True
    }


@app.get("/api-keys")
def list_api_keys(
    current_user: User = Depends(jwt_guard),
    db: Session = Depends(get_db)
):
    keys = db.query(APIKey).filter(
        APIKey.user_id == current_user.id
    ).all()

    return [
        {
            "id": key.id,
            "name": key.name,
            "active": key.active,
            "created_at": key.created_at
        }
        for key in keys
    ]


@app.delete("/api-keys/{key_id}")
def revoke_api_key(
    key_id: int,
    current_user: User = Depends(jwt_guard),
    db: Session = Depends(get_db)
):
    key = db.query(APIKey).filter(
        APIKey.id == key_id,
        APIKey.user_id == current_user.id
    ).first()

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
def protected(user=Depends(jwt_guard)):
    return {
        "message": "success",
        "user": {
            "id": user.id,
            "email": user.email
        }
    }


@app.get("/gateway/test")
def gateway_test(api_key=Depends(api_key_guard)):
    return {
        "message": "Gateway access successful"
    }


@app.get("/gateway/weather")
async def weather_gateway(api_key=Depends(api_key_guard)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://rateshield-weather.onrender.com/weather"
        )

    return response.json()


@app.get("/dashboard")
def dashboard(
    current_user: User = Depends(jwt_guard),
    db: Session = Depends(get_db)
):
    total_api_keys = db.query(APIKey).filter(
        APIKey.user_id == current_user.id
    ).count()

    active_api_keys = db.query(APIKey).filter(
        APIKey.user_id == current_user.id,
        APIKey.active.is_(True)
    ).count()

    try:
        total_requests = int(
            redis_client.redis_client.get(
                f"stats:user:{current_user.id}:total"
            ) or 0
        )

        approved_requests = int(
            redis_client.redis_client.get(
                f"stats:user:{current_user.id}:approved"
            ) or 0
        )

        blocked_requests = int(
            redis_client.redis_client.get(
                f"stats:user:{current_user.id}:blocked"
            ) or 0
        )

    except Exception:
        total_requests = 0
        approved_requests = 0
        blocked_requests = 0

    success_rate = 0

    if total_requests > 0:
        success_rate = round(
            approved_requests / total_requests * 100,
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
        "success_rate": success_rate
    }


@app.get("/health")
async def health():
    db_status = "healthy"
    redis_status = "healthy"
    weather_status = "healthy"

    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
    except Exception:
        db_status = "unhealthy"

    try:
        redis_client.redis_client.ping()
    except Exception:
        redis_status = "unhealthy"

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            res = await client.get(
                "https://rateshield-weather.onrender.com/health"
            )

        if res.status_code != 200:
            weather_status = "unhealthy"

    except Exception:
        weather_status = "unhealthy"

    overall = "healthy"

    if (
        db_status != "healthy"
        or redis_status != "healthy"
        or weather_status != "healthy"
    ):
        overall = "unhealthy"

    response = {
        "status": overall,
        "services": {
            "database": db_status,
            "redis": redis_status,
            "weather_service": weather_status
        }
    }

    if overall == "healthy":
        return response

    return JSONResponse(
        status_code=503,
        content=response
    )