import pytest
import fakeredis
from fastapi.testclient import TestClient

import redis_client
import limiter
from main import app


@pytest.fixture(autouse=True)
def fake_redis():
    fake = fakeredis.FakeRedis(decode_responses=True)

    # override redis everywhere
    redis_client.redis_client = fake
    limiter.redis_client = fake

    yield


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c