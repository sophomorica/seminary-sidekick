from pydantic import BaseModel, EmailStr
from uuid import UUID
from enum import Enum

class TestamentBase(BaseModel):
    name: str

class Testament(TestamentBase):
    id: int

    class Config:
        from_attributes = True

class DoctrinalMasteryBase(BaseModel):
    name: str
    reference: str
    hint: str
    passage: str

class DoctrinalMastery(DoctrinalMasteryBase):
    id: UUID
    testament_id: int

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: UUID

    class Config:
        from_attributes = True

# Add more Pydantic models as needed