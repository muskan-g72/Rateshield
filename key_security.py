import hashlib
import secrets


def generate_api_key():
    return "rk_" + secrets.token_urlsafe(32)


def hash_api_key(key: str):
    return hashlib.sha256(key.encode()).hexdigest()