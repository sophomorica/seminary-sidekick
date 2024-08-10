from sqlalchemy import Column, ForeignKey, Integer, String, Text, Boolean, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import enum
import uuid

Base = declarative_base()

class TestamentEnum(enum.Enum):
    new_testament = "New Testament"
    old_testament = "Old Testament"
    book_of_mormon = "Book of Mormon"
    doctrine_and_covenants = "Doctrine and Covenants"

class Testament(Base):
    __tablename__ = 'testaments'

    id = Column(Integer, primary_key=True)
    name = Column(Enum(TestamentEnum), nullable=False, unique=True)

    doctrinal_masteries = relationship('DoctrinalMastery', back_populates='testament')

class DoctrinalMastery(Base):
    __tablename__ = 'doctrinal_masteries'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    reference = Column(String(255), nullable=False)
    hint = Column(Text, nullable=False)
    passage = Column(Text, nullable=False)
    testament_id = Column(Integer, ForeignKey('testaments.id'))

    testament = relationship('Testament', back_populates='doctrinal_masteries')

class User(Base):
    __tablename__ = 'users'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String(255), nullable=False, unique=True)
    email = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)

    progress = relationship('UserProgress', back_populates='user')
    game_scores = relationship('GameScore', back_populates='user')

class Game(Base):
    __tablename__ = 'games'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False, unique=True)

    scores = relationship('GameScore', back_populates='game')

class UserProgress(Base):
    __tablename__ = 'user_progress'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    doctrinal_mastery_id = Column(UUID(as_uuid=True), ForeignKey('doctrinal_masteries.id'))
    memorized = Column(Boolean, default=False)
    mastered = Column(Boolean, default=False)

    user = relationship('User', back_populates='progress')
    doctrinal_mastery = relationship('DoctrinalMastery')

class GameScore(Base):
    __tablename__ = 'game_scores'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    game_id = Column(UUID(as_uuid=True), ForeignKey('games.id'))
    score = Column(Integer, nullable=False)
    completed_at = Column(DateTime, nullable=False)

    user = relationship('User', back_populates='game_scores')
    game = relationship('Game', back_populates='scores')