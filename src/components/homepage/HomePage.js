import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import './homepage.css';

const HomePage = () => {
  return (
    <div className="app">
      <Header />
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-message">
          <h1>Welcome to Seminary Sidekick</h1>
          <p>Enhance your scripture knowledge and mastery</p>
          <Link to="/games" className="get-started-button btn btn-primary btn-lg">
            Get Started
          </Link>
        </div>
      </div>

      <section className="features-section py-5">
        <div className="container">
          <h2 className="text-center mb-5">Learn Through Play</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="feature-card text-center">
                <div className="feature-icon">📖</div>
                <h4>Scripture Quiz</h4>
                <p>Test your knowledge of doctrinal mastery passages with interactive quizzes.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card text-center">
                <div className="feature-icon">🔗</div>
                <h4>Matching Game</h4>
                <p>Match scripture references with their doctrinal mastery names.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card text-center">
                <div className="feature-icon">📝</div>
                <h4>Scripture Journal</h4>
                <p>Record your spiritual insights and track your scripture study journey.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
