import React from 'react';
import { Link } from 'react-router-dom';
import './dashboard.css';

const Dashboard = () => {
  const progressStats = {
    totalPassages: 100,
    memorized: 0,
    mastered: 0,
    quizzesTaken: 0,
    averageScore: 0
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Your Dashboard</h1>

      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <h5 className="card-title">Progress</h5>
              <div className="display-4 text-primary">{progressStats.memorized}</div>
              <p className="text-muted">of {progressStats.totalPassages} passages memorized</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <h5 className="card-title">Quizzes</h5>
              <div className="display-4 text-success">{progressStats.quizzesTaken}</div>
              <p className="text-muted">quizzes completed</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <h5 className="card-title">Average Score</h5>
              <div className="display-4 text-info">{progressStats.averageScore}%</div>
              <p className="text-muted">quiz accuracy</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Quick Actions</h5>
              <div className="d-grid gap-2">
                <Link to="/quiz" className="btn btn-primary">Start a Quiz</Link>
                <Link to="/matching" className="btn btn-outline-primary">Play Matching Game</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Recent Activity</h5>
              <p className="text-muted">No recent activity yet. Start learning to track your progress!</p>
            </div>
          </div>
        </div>
      </div>

      <div className="alert alert-info mt-4">
        <strong>Coming Soon:</strong> User accounts and progress tracking will be available in a future update.
        Your progress will be saved automatically once you create an account.
      </div>
    </div>
  );
};

export default Dashboard;
