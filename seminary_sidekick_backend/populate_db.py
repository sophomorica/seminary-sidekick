import json
import uuid
from sqlalchemy import create_engine, Column, Integer, String, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

# Database connection setup
DATABASE_URL = "postgresql:///seminary_sidekick"
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
Base = declarative_base()

# Define models
class Testament(Base):
    __tablename__ = 'testaments'
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False, unique=True)

class DoctrinalMastery(Base):
    __tablename__ = 'doctrinal_masteries'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    reference = Column(String(255), nullable=False)
    hint = Column(Text, nullable=False)
    passage = Column(Text)
    testament_id = Column(Integer, ForeignKey('testaments.id'))

# Load JSON data from file
with open('/Users/pieceofpatrick/Desktop/seminary/seminary-sidekick/public/data/passages.json') as f:
    data = json.load(f)

def insert_doctrinal_mastery():
    with Session() as session:
        # Mapping for testament names
        testament_mapping = {
            "old_testament": "Old Testament",
            "new_testament": "New Testament",
            "book_of_mormon": "Book of Mormon",
            "doctrine_and_covenants": "Doctrine and Covenants"
        }

        # Fetch all testaments
        testaments = {t.name: t.id for t in session.query(Testament).all()}

        for json_name, masteries in data.items():
            testament_name = testament_mapping[json_name]
            testament_id = testaments[testament_name]

            for mastery in masteries:
                new_mastery = DoctrinalMastery(
                    id=uuid.UUID(mastery["id"]),
                    name=mastery["name"],
                    reference=mastery["reference"],
                    hint=mastery["passage"],
                    passage=mastery.get("fullPassage", ""),
                    testament_id=testament_id
                )
                session.add(new_mastery)
        
        try:
            session.commit()
            print("Data insertion completed successfully.")
        except Exception as e:
            print(f"An error occurred during commit: {str(e)}")
            session.rollback()

# Run the insertion
if __name__ == "__main__":
    insert_doctrinal_mastery()