import strawberry
from strawberry.types import Info
from typing import List
from models import Testament as TestamentModel, DoctrinalMastery as DoctrinalMasteryModel
from sqlalchemy.orm import Session
from database import SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@strawberry.type
class Testament:
    id: int
    name: str

@strawberry.type
class DoctrinalMastery:
    id: strawberry.ID
    name: str
    reference: str
    hint: str
    passage: str
    testament_id: int

@strawberry.type
class Query:
    @strawberry.field
    def testaments(self, info: Info) -> List[Testament]:
        db: Session = next(get_db())
        return db.query(TestamentModel).all()

    @strawberry.field
    def testament(self, info: Info, id: int) -> Testament:
        db: Session = next(get_db())
        return db.query(TestamentModel).filter(TestamentModel.id == id).first()

    @strawberry.field
    def doctrinal_masteries(self, info: Info) -> List[DoctrinalMastery]:
        db: Session = next(get_db())
        return db.query(DoctrinalMasteryModel).all()

    @strawberry.field
    def doctrinal_mastery(self, info: Info, id: strawberry.ID) -> DoctrinalMastery:
        db: Session = next(get_db())
        return db.query(DoctrinalMasteryModel).filter(DoctrinalMasteryModel.id == id).first()

schema = strawberry.Schema(query=Query)