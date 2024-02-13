import React from 'react';
import PropTypes from 'prop-types';

const Score = ({ score }) => {
  return (
    <div className="score-container">
      <h2 className="score-title">Score: {score}</h2>
    </div>
  );
};

Score.propTypes = {
  score: PropTypes.number.isRequired,
};

export default Score;
