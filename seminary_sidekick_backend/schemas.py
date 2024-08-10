from pydantic import BaseModel
from uuid import UUID

class TestamentBase(BaseModel):
    name: str

class TestamentCreate(TestamentBase):
    pass

class Testament(TestamentBase):
    id: int

    class Config:
        orm_mode = True

class BookBase(BaseModel):
    name: str
    testament_id: int

class BookCreate(BookBase):
    pass

class Book(BookBase):
    id: int

    class Config:
        orm_mode = True

class ScriptureBase(BaseModel):
    name: str
    reference: str
    passage: str
    full_passage: str
    book_id: int

class ScriptureCreate(ScriptureBase):
    pass

class Scripture(ScriptureBase):
    id: UUID

    class Config:
        orm_mode = True

# Add more Pydantic models for other entities as needed
