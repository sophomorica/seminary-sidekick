import React from 'react';
import { Link } from 'react-router-dom';
import './gamepage.css';

const GamePage = () => {
  const games = [
    {
      id: 'quiz',
      title: 'Scripture Quiz',
      description: 'Test your knowledge of doctrinal mastery passages with multiple choice questions.',
      icon: '📝',
      path: '/quiz',
      available: true
    },
    {
      id: 'matching',
      title: 'Matching Game',
      description: 'Match scripture references with their doctrinal mastery names.',
      icon: '🔗',
      path: '/matching',
      available: true
    },
    {
      id: 'memory',
      title: 'Memory Challenge',
      description: 'Memorize scripture passages with flashcard-style learning.',
      icon: '🧠',
      path: '/memory',
      available: false
    },
    {
      id: 'fill-blank',
      title: 'Fill in the Blank',
      description: 'Complete scripture passages by filling in missing words.',
      icon: '✏️',
      path: '/fill-blank',
      available: false
    }
  ];

  return (
    <div className="container py-4">
      <h1 className="mb-2">Scripture Games</h1>
      <p className="lead text-muted mb-4">
        Choose a game to practice and improve your scripture mastery skills.
      </p>

      <div className="row">
        {games.map((game) => (
          <div key={game.id} className="col-md-6 mb-4">
            <div className={`card h-100 ${!game.available ? 'opacity-75' : ''}`}>
              <div className="card-body d-flex flex-column">
                <div className="display-4 mb-3">{game.icon}</div>
                <h5 className="card-title">{game.title}</h5>
                <p className="card-text text-muted flex-grow-1">{game.description}</p>
                {game.available ? (
                  <Link to={game.path} className="btn btn-primary mt-auto">
                    Play Now
                  </Link>
                ) : (
                  <button className="btn btn-secondary mt-auto" disabled>
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card mt-4 bg-light">
        <div className="card-body">
          <h5 className="card-title">Tip of the Day</h5>
          <p className="card-text mb-0">
            Regular practice with scripture games can help you memorize passages more effectively.
            Try to spend at least 10-15 minutes each day practicing!
          </p>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
