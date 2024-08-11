from sqlalchemy.orm import Session
import models, schemas
from uuid import UUID

def get_testaments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Testament).offset(skip).limit(limit).all()

def get_doctrinal_masteries(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.DoctrinalMastery).offset(skip).limit(limit).all()

def get_user(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.id == UUID(user_id)).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    fake_hashed_password = user.password + "notreallyhashed"
    db_user = models.User(email=user.email, username=user.username, password_hash=fake_hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Add more CRUD operations as needed