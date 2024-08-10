import json
from sqlalchemy.orm import Session
from database import SessionLocal
import models, schemas

def populate_database():
    db = SessionLocal()
    
    with open('/Users/pieceofpatrick/Desktop/seminary/seminary-sidekick/public/data/passages.json', 'r') as f:
        data = json.load(f)
    
    for testament_name, books in data.items():
        testament = create_testament(db, schemas.TestamentCreate(name=testament_name))
        for book_name, scriptures in books.items():
            book = create_book(db, schemas.BookCreate(name=book_name, testament_id=testament.id))
            for scripture in scriptures:
                create_scripture(db, schemas.ScriptureCreate(
                    name=scripture['name'],
                    reference=scripture['reference'],
                    passage=scripture['passage'],
                    full_passage=scripture['fullPassage'],
                    book_id=book.id
                ))
    
    db.close()

def create_testament(db: Session, testament: schemas.TestamentCreate):
    db_testament = models.Testament(name=testament.name)
    db.add(db_testament)
    db.commit()
    db.refresh(db_testament)
    return db_testament

def create_book(db: Session, book: schemas.BookCreate):
    db_book = models.Book(**book.dict())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

def create_scripture(db: Session, scripture: schemas.ScriptureCreate):
    db_scripture = models.Scripture(**scripture.dict())
    db.add(db_scripture)
    db.commit()
    db.refresh(db_scripture)
    return db_scripture

if __name__ == "__main__":
    populate_database()
    print("Database populated successfully.")
