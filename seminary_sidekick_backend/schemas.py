from pydantic import BaseModel, EmailStr
from uuid import UUID
from enum import Enum

class TestamentEnum(str, Enum):
    new_testament = "New Testament"
    old_testament = "Old Testament"
    book_of_mormon = "Book of Mormon"
    doctrine_and_covenants = "Doctrine and Covenants"

class TestamentBase(BaseModel):
    name: TestamentEnum

class Testament(TestamentBase):
    id: int

    class Config:
        orm_mode = True

class DoctrinalMasteryBase(BaseModel):
    name: str
    reference: str
    hint: str
    passage: str

class DoctrinalMastery(DoctrinalMasteryBase):
    id: UUID
    testament_id: int

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: UUID

    class Config:
        orm_mode = True

# Add more Pydantic models as needed