from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import crud, models, schemas

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
    return {"Hello": "Welcome to Seminary Sidekick"}

@app.get("/testaments", response_model=list[schemas.Testament])
def read_testaments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    testaments = crud.get_testaments(db, skip=skip, limit=limit)
    print("Fetched testaments:", testaments)  # Debug print
    return testaments

@app.get("/doctrinal-masteries", response_model=list[schemas.DoctrinalMastery])
def read_doctrinal_masteries(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    doctrinal_masteries = crud.get_doctrinal_masteries(db, skip=skip, limit=limit)
    return doctrinal_masteries

@app.get("/doctrinal-mastery/{testament_id}", response_model=list[schemas.DoctrinalMastery])
def read_doctrinal_masteries_by_testament_id(testament_id: int, db: Session = Depends(get_db)):
    doctrinal_masteries = crud.get_doctrinal_masteries_by_testament_id(db, testament_id=testament_id)
    return doctrinal_masteries

@app.post("/users", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: str, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# Add more endpoints as needed