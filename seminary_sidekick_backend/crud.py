from sqlalchemy.orm import Session
from . import models, schemas
from uuid import UUID
from sqlalchemy.orm import joinedload

# Testament CRUD Operations
def get_testament(db: Session, testament_id: int):
    return db.query(models.Testament).filter(models.Testament.id == testament_id).first()

def get_testaments(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Testament).offset(skip).limit(limit).all()

def create_testament(db: Session, testament: schemas.TestamentCreate):
    db_testament = models.Testament(name=testament.name)
    db.add(db_testament)
    db.commit()
    db.refresh(db_testament)
    return db_testament

def get_testament_with_masteries(db: Session, testament_id: int):
    return db.query(models.Testament).options(joinedload(models.Testament.doctrinal_masteries)).filter(models.Testament.id == testament_id).first()

# Doctrinal Mastery CRUD Operations
def get_doctrinal_mastery(db: Session, doctrinal_mastery_id: UUID):
    return db.query(models.DoctrinalMastery).filter(models.DoctrinalMastery.id == doctrinal_mastery_id).first()

def get_doctrinal_masteries(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.DoctrinalMastery).offset(skip).limit(limit).all()

def create_doctrinal_mastery(db: Session, doctrinal_mastery: schemas.DoctrinalMasteryCreate):
    db_doctrinal_mastery = models.DoctrinalMastery(**doctrinal_mastery.dict())
    db.add(db_doctrinal_mastery)
    db.commit()
    db.refresh(db_doctrinal_mastery)
    return db_doctrinal_mastery

def get_doctrinal_mastery_with_testament(db: Session, doctrinal_mastery_id: UUID):
    return db.query(models.DoctrinalMastery).options(joinedload(models.DoctrinalMastery.testament)).filter(models.DoctrinalMastery.id == doctrinal_mastery_id).first()

# User CRUD Operations
def get_user(db: Session, user_id: UUID):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_users(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    fake_hashed_password = user.password + "notreallyhashed"
    db_user = models.User(username=user.username, email=user.email, password_hash=fake_hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_with_progress(db: Session, user_id: UUID):
    return db.query(models.User).options(joinedload(models.User.progress)).filter(models.User.id == user_id).first()

def get_user_with_game_scores(db: Session, user_id: UUID):
    return db.query(models.User).options(joinedload(models.User.game_scores)).filter(models.User.id == user_id).first()

# Game CRUD Operations
def get_game(db: Session, game_id: UUID):
    return db.query(models.Game).filter(models.Game.id == game_id).first()

def get_games(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Game).offset(skip).limit(limit).all()

def create_game(db: Session, game: schemas.GameCreate):
    db_game = models.Game(name=game.name)
    db.add(db_game)
    db.commit()
    db.refresh(db_game)
    return db_game

def get_game_with_scores(db: Session, game_id: UUID):
    return db.query(models.Game).options(joinedload(models.Game.scores)).filter(models.Game.id == game_id).first()

# UserProgress CRUD Operations
def get_user_progress(db: Session, user_progress_id: UUID):
    return db.query(models.UserProgress).filter(models.UserProgress.id == user_progress_id).first()

def get_user_progresses(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.UserProgress).offset(skip).limit(limit).all()

def create_user_progress(db: Session, user_progress: schemas.UserProgressCreate):
    db_user_progress = models.UserProgress(**user_progress.dict())
    db.add(db_user_progress)
    db.commit()
    db.refresh(db_user_progress)
    return db_user_progress

# GameScore CRUD Operations
def get_game_score(db: Session, game_score_id: UUID):
    return db.query(models.GameScore).filter(models.GameScore.id == game_score_id).first()

def get_game_scores(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.GameScore).offset(skip).limit(limit).all()

def create_game_score(db: Session, game_score: schemas.GameScoreCreate):
    db_game_score = models.GameScore(**game_score.dict())
    db.add(db_game_score)
    db.commit()
    db.refresh(db_game_score)
    return db_game_score