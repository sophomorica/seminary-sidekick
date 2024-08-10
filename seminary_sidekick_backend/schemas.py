from pydantic import BaseModel, EmailStr
from uuid import UUID
from typing import Optional, List
from datetime import datetime
from enum import Enum

class TestamentEnum(str, Enum):
    new_testament = "New Testament"
    old_testament = "Old Testament"
    book_of_mormon = "Book of Mormon"
    doctrine_and_covenants = "Doctrine and Covenants"

class TestamentBase(BaseModel):
    name: TestamentEnum

class TestamentCreate(TestamentBase):
    pass

class Testament(TestamentBase):
    id: int
    class Config:
        orm_mode = True

class DoctrinalMasteryBase(BaseModel):
    name: str
    reference: str
    hint: str
    passage: str

class DoctrinalMasteryCreate(DoctrinalMasteryBase):
    testament_id: int

class DoctrinalMastery(DoctrinalMasteryBase):
    id: UUID
    testament_id: int
    class Config:
        orm_mode = True

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: UUID
    class Config:
        orm_mode = True

class GameBase(BaseModel):
    name: str

class GameCreate(GameBase):
    pass

class Game(GameBase):
    id: UUID
    class Config:
        orm_mode = True

class UserProgressBase(BaseModel):
    memorized: bool
    mastered: bool

class UserProgressCreate(UserProgressBase):
    user_id: UUID
    doctrinal_mastery_id: UUID

class UserProgress(UserProgressBase):
    id: UUID
    user_id: UUID
    doctrinal_mastery_id: UUID
    class Config:
        orm_mode = True

class GameScoreBase(BaseModel):
    score: int
    completed_at: datetime

class GameScoreCreate(GameScoreBase):
    user_id: UUID
    game_id: UUID

class GameScore(GameScoreBase):
    id: UUID
    user_id: UUID
    game_id: UUID
    class Config:
        orm_mode = True

# Additional schemas for relationships and responses

class DoctrinalMasteryWithTestament(DoctrinalMastery):
    testament: Testament

class UserWithProgress(User):
    progress: List[UserProgress] = []

class UserWithGameScores(User):
    game_scores: List[GameScore] = []

class GameWithScores(Game):
    scores: List[GameScore] = []

class TestamentWithDoctrinalMasteries(Testament):
    doctrinal_masteries: List[DoctrinalMastery] = []