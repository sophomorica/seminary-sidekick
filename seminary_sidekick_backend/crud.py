from sqlalchemy.orm import Session
from passlib.context import CryptContext
from uuid import UUID
import models
import schemas

# Password hashing configuration using bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Generate a secure hash for a password."""
    return pwd_context.hash(password)


# Retrieve all testaments from the database
def get_testaments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Testament).offset(skip).limit(limit).all()


# Retrieve all doctrinal masteries from the database
def get_doctrinal_masteries(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.DoctrinalMastery).offset(skip).limit(limit).all()


# Retrieve a doctrinal mastery by its ID
def get_doctrinal_mastery_by_id(db: Session, mastery_id: str):
    return db.query(models.DoctrinalMastery).filter(
        models.DoctrinalMastery.id == UUID(mastery_id)
    ).first()


# Retrieve all doctrinal masteries associated with a testament ID
def get_doctrinal_masteries_by_testament_id(db: Session, testament_id: int):
    return db.query(models.DoctrinalMastery).filter(
        models.DoctrinalMastery.testament_id == testament_id
    ).all()


# Retrieve all doctrinal masteries associated with a testament name
def get_doctrinal_masteries_by_testament_name(db: Session, testament_name: str):
    testament = db.query(models.Testament).filter(
        models.Testament.name == testament_name
    ).first()
    if not testament:
        return []
    return db.query(models.DoctrinalMastery).filter(
        models.DoctrinalMastery.testament_id == testament.id
    ).all()


# Retrieve a user by their ID
def get_user(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.id == UUID(user_id)).first()


# Retrieve all user progress records for a user
def get_user_progress(db: Session, user_id: str):
    return db.query(models.UserProgress).filter(
        models.UserProgress.user_id == UUID(user_id)
    ).all()


# Retrieve a user by their email
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


# Retrieve a user by their username
def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


# Create a new user with secure password hashing
def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        username=user.username,
        password_hash=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# Authenticate a user
def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user
