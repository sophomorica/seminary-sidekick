# Seminary Sidekick

An interactive web application designed to help LDS seminary students master scriptures and doctrinal passages through engaging games and learning tools.

## Features

- **Scripture Quiz**: Test your knowledge of doctrinal mastery passages with multiple-choice questions
- **Matching Game**: Match scripture references with their doctrinal mastery names using drag-and-drop
- **Scripture Journal**: Record your spiritual insights and track your scripture study journey
- **Dashboard**: Track your learning progress and quiz performance
- **Multiple Testament Support**: Practice with passages from the Book of Mormon, Old Testament, New Testament, and Doctrine & Covenants

## Tech Stack

### Frontend
- React 18
- React Router DOM
- React Bootstrap
- Redux (state management)
- Axios (HTTP client)

### Backend
- FastAPI (Python web framework)
- Strawberry GraphQL
- SQLAlchemy (ORM)
- PostgreSQL (database)
- Passlib with bcrypt (secure password hashing)

## Prerequisites

- Node.js 16+ and npm
- Python 3.9+
- PostgreSQL 13+

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/sophomorica/seminary-sidekick.git
cd seminary-sidekick
```

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

1. Create and activate a virtual environment:
```bash
cd seminary_sidekick_backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Create the PostgreSQL database:
```bash
createdb seminary_sidekick
```

5. Start the backend server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- GraphQL Playground: `http://localhost:8000/graphql`

## Docker Deployment

For easy deployment, use Docker Compose:

```bash
docker-compose up --build
```

This will start:
- Frontend on port 3000
- Backend API on port 8000
- PostgreSQL database on port 5432

## Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://localhost/seminary_sidekick` |
| `ALLOWED_ORIGINS` | Comma-separated list of CORS origins | `http://localhost:3000` |
| `LOG_LEVEL` | Logging level | `INFO` |

### Frontend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:8000` |
| `REACT_APP_GRAPHQL_URL` | GraphQL endpoint | `http://localhost:8000/graphql` |

## Project Structure

```
seminary-sidekick/
├── public/                    # Static assets
│   ├── data/                  # Scripture passage data (JSON)
│   └── index.html
├── src/                       # React frontend
│   ├── components/            # React components
│   │   ├── quiz/              # Quiz game
│   │   ├── matchinggame/      # Matching game
│   │   ├── dashboard/         # User dashboard
│   │   ├── affirmation/       # Scripture journal
│   │   └── ...
│   ├── App.js                 # Main app component
│   └── index.js               # Entry point
├── seminary_sidekick_backend/ # FastAPI backend
│   ├── main.py                # FastAPI application
│   ├── models.py              # SQLAlchemy models
│   ├── schemas.py             # Pydantic schemas
│   ├── crud.py                # Database operations
│   ├── graphql_schema.py      # GraphQL schema
│   └── requirements.txt       # Python dependencies
├── docker-compose.yml         # Docker orchestration
├── Dockerfile                 # Frontend Docker image
└── README.md
```

## API Endpoints

### REST API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | API information |
| `GET` | `/health` | Health check |
| `POST` | `/api/users/` | Create new user |
| `GET` | `/api/users/{id}` | Get user by ID |
| `GET` | `/api/testaments/` | List all testaments |
| `GET` | `/api/doctrinal-masteries/` | List all passages |
| `GET` | `/api/doctrinal-masteries/{id}` | Get passage by ID |

### GraphQL

Access the GraphQL playground at `/graphql` for interactive queries.

Example query:
```graphql
query {
  doctrinalMasteries {
    id
    name
    reference
    hint
    passage
  }
}
```

## Development

### Running Tests

Frontend:
```bash
npm test
```

### Linting

```bash
npm run lint
npm run lint:fix  # Auto-fix issues
```

### Building for Production

```bash
npm run build
```

## Scripture Data

The app includes doctrinal mastery passages organized by testament:
- **Book of Mormon**: Key passages from Nephi through Moroni
- **Old Testament**: Essential verses from Genesis through Malachi
- **New Testament**: Core teachings from Matthew through Revelation
- **Doctrine & Covenants**: Modern revelations and principles

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

- [ ] User authentication and accounts
- [ ] Progress tracking and persistence
- [ ] Memory challenge game
- [ ] Fill-in-the-blank exercises
- [ ] Spaced repetition learning
- [ ] Mobile app (React Native)
- [ ] Offline support (PWA)
- [ ] Social features and messaging

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Scripture content based on the LDS Doctrinal Mastery program
- Built with love for seminary students everywhere
