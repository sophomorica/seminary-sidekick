from sqlalchemy.orm import Session
import models, schemas

def create_testament(db: Session, testament: schemas.TestamentCreate):
    db_testament = models.Testament(name=testament.name)
    db.add(db_testament)
    db.commit()
    db.refresh(db_testament)
    return db_testament

def get_testaments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Testament).offset(skip).limit(limit).all()

def create_book(db: Session, book: schemas.BookCreate):
    db_book = models.Book(**book.dict())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

def get_books(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Book).offset(skip).limit(limit).all()

def create_scripture(db: Session, scripture: schemas.ScriptureCreate):
    db_scripture = models.Scripture(**scripture.dict())
    db.add(db_scripture)
    db.commit()
    db.refresh(db_scripture)
    return db_scripture

def get_scriptures(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Scripture).offset(skip).limit(limit).all()

# Add more CRUD operations as needed
