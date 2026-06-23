from sqlalchemy import Column, Integer, String, Boolean, DateTime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    plan = Column(String, default="free")


class APIKey(Base):
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)

    key_hash = Column(String, unique=True, nullable=False)

    name = Column(String, default="Default Key")
    active = Column(Boolean, default=True)
    created_at = Column(DateTime)