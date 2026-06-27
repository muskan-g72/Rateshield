from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class Settings(BaseSettings):
    DATABASE_URL: str
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    WEATHER_URL: str
    JWT_SECRET: str

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()