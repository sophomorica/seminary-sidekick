from sqlalchemy.orm import Session
import models, schemas
from uuid import UUID
from sqlalchemy.orm import Session
import models, schemas
from uuid import UUID
# Retrieve all testaments from the database
def get_testaments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Testament).offset(skip).limit(limit).all()

# Retrieve all doctrinal masteries from the database
def get_doctrinal_masteries(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.DoctrinalMastery).offset(skip).limit(limit).all()

# Retrieve a doctrinal mastery by its ID
def get_doctrinal_mastery_by_id(db: Session, mastery_id: str):
    return db.query(models.DoctrinalMastery).filter(models.DoctrinalMastery.id == UUID(mastery_id)).first()

# Retrieve all doctrinal masteries associated with a testament ID
def get_doctrinal_masteries_by_testament_id(db: Session, testament_id: int):
    return db.query(models.DoctrinalMastery).filter(models.DoctrinalMastery.testament_id == testament_id).all()

# Retrieve all doctrinal masteries associated with a testament name
def get_doctrinal_masteries_by_testament_name(db: Session, testament_name: str):
    testament = db.query(models.Testament).filter(models.Testament.name == testament_name).first()
    return db.query(models.DoctrinalMastery).filter(models.DoctrinalMastery.testament_id == testament.id).all()

# Retrieve a user by their ID
def get_user(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.id == UUID(user_id)).first()

# Retrieve all user progress records for a user
def get_user_progress(db: Session, user_id: str):
    return db.query(models.UserProgress).filter(models.UserProgress.user_id == UUID(user_id)).all()

# Retrieve a user by their email
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

# Create a new user
def create_user(db: Session, user: schemas.UserCreate):
    fake_hashed_password = user.password + "notreallyhashed"
    db_user = models.User(email=user.email, username=user.username, password_hash=fake_hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Add more CRUD operations as needed