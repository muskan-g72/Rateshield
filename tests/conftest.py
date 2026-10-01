import pytest
import fakeredis
from fastapi.testclient import TestClient

from database import Base, engine
import models # noqa: F401
import redis_client
import limiter
from main import app


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield


@pytest.fixture(autouse=True)
def fake_redis():
    fake = fakeredis.FakeRedis(decode_responses=True)

    # Replace Redis client only
    redis_client.redis_client = fake

    # Force Lua script to register on FakeRedis
    limiter._rate_limit_script = None

    yield


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c