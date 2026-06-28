import json
import logging
import time

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s"
)

logger = logging.getLogger("rateshield")


class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):

        start_time = time.perf_counter()

        response = None

        try:
            response = await call_next(request)
            return response

        finally:
            process_time = (time.perf_counter() - start_time) * 1000

            logger.info(
                json.dumps(
                    {
                        "method": request.method,
                        "path": request.url.path,
                        "status_code": response.status_code if response else 500,
                        "response_time_ms": round(process_time, 2),
                        "client_ip": request.client.host if request.client else None,
                        "user_id": getattr(request.state, "user_id", None),
                        "api_key_id": getattr(request.state, "api_key_id", None),
                    }
                )
            )