import logging
import redis
from settings import settings

logger = logging.getLogger(__name__)

def create_redis_client():
    redis_url = settings.REDIS_URL
    try:
        if redis_url.startswith("rediss://"):
            return redis.from_url(
                redis_url,
                decode_responses=True,
                ssl_cert_reqs=None,
                socket_timeout=5.0,
                socket_connect_timeout=5.0,
                socket_keepalive=True,
                health_check_interval=30,
                retry_on_timeout=True,
            )
        else:
            return redis.from_url(
                redis_url,
                decode_responses=True,
                socket_timeout=5.0,
                socket_connect_timeout=5.0,
                socket_keepalive=True,
                health_check_interval=30,
                retry_on_timeout=True,
            )
    except Exception as e:
        logger.error(f"Failed to initialize Redis client: {type(e).__name__} - {e}")
        return None

redis_client = create_redis_client()