import strawberry
from strawberry.types import Info
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional
from models import DoctrinalMastery, Testament
from db import get_db

@strawberry.input
class DoctrinalMasteryInput:
    name: str
    reference: str
    hint: str
    passage: str
    testament_id: int

@strawberry.type
class DoctrinalMasteryType:
    id: UUID
    name: str
    reference: str
    hint: str
    passage: str
    testament_id: int

@strawberry.type
class DoctrinalMasteryMutations:
    @strawberry.mutation
    def create_doctrinal_mastery(self, input: DoctrinalMasteryInput, info: Info) -> DoctrinalMasteryType:
        db: Session = info.context["db"]
        new_mastery = DoctrinalMastery(
            name=input.name,
            reference=input.reference,
            hint=input.hint,
            passage=input.passage,
            testament_id=input.testament_id
        )
        db.add(new_mastery)
        db.commit()
        db.refresh(new_mastery)
        return DoctrinalMasteryType(**new_mastery.__dict__)

    @strawberry.mutation
    def update_doctrinal_mastery(self, id: UUID, input: DoctrinalMasteryInput, info: Info) -> Optional[DoctrinalMasteryType]:
        db: Session = info.context["db"]
        mastery = db.query(DoctrinalMastery).filter(DoctrinalMastery.id == id).first()
        if not mastery:
            return None
        for key, value in input.__dict__.items():
            setattr(mastery, key, value)
        db.commit()
        db.refresh(mastery)
        return DoctrinalMasteryType(**mastery.__dict__)

    @strawberry.mutation
    def delete_doctrinal_mastery(self, id: UUID, info: Info) -> bool:
        db: Session = info.context["db"]
        mastery = db.query(DoctrinalMastery).filter(DoctrinalMastery.id == id).first()
        if not mastery:
            return False
        db.delete(mastery)
        db.commit()
        return True

@strawberry.type
class Query:
    @strawberry.field
    def hello(self) -> str:
        return "Hello, World!"

schema = strawberry.Schema(query=Query, mutation=DoctrinalMasteryMutations)