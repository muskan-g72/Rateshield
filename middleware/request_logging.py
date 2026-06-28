import json
import logging
import time

from fastapi import Request

logger = logging.getLogger("rateshield")


async def logging_middleware(request: Request, call_next):
    start_time = time.perf_counter()

    response = await call_next(request)

    process_time = (time.perf_counter() - start_time) * 1000

    logger.info(
        json.dumps(
            {
                "method": request.method,
                "path": request.url.path,
                "status_code": response.status_code,
                "response_time_ms": round(process_time, 2),
                "client_ip": request.client.host if request.client else None,
                "user_id": getattr(request.state, "user_id", None),
                "api_key_id": getattr(request.state, "api_key_id", None),
            }
        )
    )

    return response