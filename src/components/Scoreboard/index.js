
// src/components/Scoreboard/index.js
import React from 'react';

const Scoreboard = ({ scores }) => {
  const { roundsPlayed, wins, losses, winPercentage } = scores;

  return (
    <div className="Scoreboard">
      <h3>Scoreboard</h3>
      <p>Rounds Played: {roundsPlayed}</p>
      <p>Wins: {wins}</p>
      <p>Losses: {losses}</p>
      <p>Win Percentage: {winPercentage.toFixed(2)}%</p>
    </div>
  );
};

export default Scoreboard;
