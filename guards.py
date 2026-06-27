from fastapi import Depends

from auth import validate_api_key
from jwt_auth import get_current_user
from limiter import check_rate_limit


def api_key_guard(data=Depends(validate_api_key)):
    check_rate_limit(data)
    return data


def jwt_guard(user=Depends(get_current_user)):
    data = {
        "api_key": f"jwt:{user.id}",
        "user_id": user.id
    }

    check_rate_limit(data)
    return user