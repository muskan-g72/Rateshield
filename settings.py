from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./rateshield.db")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    WEATHER_URL: str = os.getenv("WEATHER_URL", "https://rateshield-weather.onrender.com")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "rateshield-secret-key-for-jwt-tokens")
    FAIL_OPEN: bool = os.getenv("FAIL_OPEN", "false").lower() in ("true", "1", "yes")

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

settings = Settings()