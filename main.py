from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models
from database import SessionLocal
from models import User
from models import APIKey
import secrets
from fastapi import Depends
from auth import validate_api_key
from redis_client import redis_client
from limiter import check_rate_limit
import httpx

app = FastAPI()

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
def register(name: str, email: str):
    db = SessionLocal()
    user = User(
        name=name,
        email=email
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": "User created",
        "user_id": user.id
    }
@app.post("/generate-key")
def generate_key(user_id: int):
    db = SessionLocal()
    key = secrets.token_hex(16)
    api_key = APIKey(
        user_id=user_id,
        api_key=key
    )
    db.add(api_key)
    db.commit()

    return {
        "api_key": key
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
            "http://127.0.0.1:8001/weather"
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