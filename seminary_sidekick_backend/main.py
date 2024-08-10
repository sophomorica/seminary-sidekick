from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, schemas, crud

app = FastAPI()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/testaments/", response_model=list[schemas.Testament])
def read_testaments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    testaments = crud.get_testaments(db, skip=skip, limit=limit)
    return testaments

# Add more endpoints here for books, scriptures, etc.

# Uncomment this if you need to create tables (though you might prefer to use create_tables.py for this)
# models.Base.metadata.create_all(bind=engine)