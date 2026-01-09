import os
import logging
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
from sqlalchemy.orm import Session

from graphql_schema import schema
from database import SessionLocal, engine
import models
import crud
import schemas

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Seminary Sidekick API",
    description="Backend API for Seminary Sidekick - a scripture mastery learning application",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
# In production, replace "*" with your actual frontend domain
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# GraphQL router
graphql_app = GraphQLRouter(schema)
app.include_router(graphql_app, prefix="/graphql")


@app.get("/")
def read_root():
    """Root endpoint with API information."""
    return {
        "message": "Welcome to Seminary Sidekick API",
        "version": "1.0.0",
        "docs": "/docs",
        "graphql": "/graphql"
    }


@app.get("/health")
def health_check():
    """Health check endpoint for monitoring."""
    return {"status": "healthy"}


@app.post("/api/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Create a new user account."""
    # Check if email already exists
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Check if username already exists
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already taken")

    logger.info(f"Creating new user: {user.username}")
    return crud.create_user(db=db, user=user)


@app.get("/api/users/{user_id}", response_model=schemas.User)
def read_user(user_id: str, db: Session = Depends(get_db)):
    """Get user by ID."""
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.get("/api/testaments/")
def read_testaments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all testaments."""
    testaments = crud.get_testaments(db, skip=skip, limit=limit)
    return testaments


@app.get("/api/doctrinal-masteries/")
def read_doctrinal_masteries(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all doctrinal mastery passages."""
    masteries = crud.get_doctrinal_masteries(db, skip=skip, limit=limit)
    return masteries


@app.get("/api/doctrinal-masteries/{mastery_id}")
def read_doctrinal_mastery(mastery_id: str, db: Session = Depends(get_db)):
    """Get a specific doctrinal mastery passage by ID."""
    mastery = crud.get_doctrinal_mastery_by_id(db, mastery_id=mastery_id)
    if mastery is None:
        raise HTTPException(status_code=404, detail="Doctrinal mastery not found")
    return mastery


@app.get("/api/testaments/{testament_name}/doctrinal-masteries/")
def read_doctrinal_masteries_by_testament(testament_name: str, db: Session = Depends(get_db)):
    """Get all doctrinal mastery passages for a specific testament."""
    masteries = crud.get_doctrinal_masteries_by_testament_name(db, testament_name=testament_name)
    return masteries


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
