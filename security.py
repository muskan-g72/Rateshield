from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi import HTTPException
from key_security import hash_api_key


# JWT Configuration
SECRET_KEY = "change_this_to_a_long_random_secret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password Hashing Configuration
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt

def verify_token(token: str):
    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        email = payload.get("sub")

        if email is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        return email

    except JWTError as e:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

def validate_api_key(x_api_key: str, db: Session):

        hashed = hash_api_key(x_api_key)

        key = db.query(APIKey).filter(
            APIKey.key_hash == hashed,
            APIKey.active == True
        ).first()

        if not key:
            raise HTTPException(status_code=401, detail="Invalid API key")

        return {
            "api_key": x_api_key,
            "user_id": key.user_id
        }