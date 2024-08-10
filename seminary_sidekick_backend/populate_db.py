import json
import uuid
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Testament, Book, Scripture

# Database connection setup
DATABASE_URL = "postgresql:///seminary_sidekick"
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

# Load JSON data from file
with open('/Users/pieceofpatrick/Desktop/seminary/seminary-sidekick/public/data/passages.json') as f:
    data = json.load(f)

# Function to insert data into the database
def insert_data():
    for testament_name, books in data.items():
        # Insert Testament
        testament = Testament(name=testament_name)
        session.add(testament)
        session.commit()  # Commit to get the ID for the testament

        for book in books:
            # Insert Book
            book_name = book.get("reference").split()[0]  # Assuming the book name is the first word in the reference
            book_record = Book(name=book_name, testament_id=testament.id)
            session.add(book_record)
            session.commit()  # Commit to get the ID for the book

            # Insert Scripture
            scripture = Scripture(
                id=uuid.UUID(book.get("id")),
                name=book.get("name"),
                reference=book.get("reference"),
                passage=book.get("passage"),
                full_passage=book.get("fullPassage"),
                book_id=book_record.id
            )
            session.add(scripture)
    
    # Commit all changes at once
    session.commit()

# Run the insertion
insert_data()

# Close the session
session.close()