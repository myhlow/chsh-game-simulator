
// src/components/GameBoard/index.js
import React from 'react';

const GameBoard = ({ lastRound }) => {
  if (!lastRound) {
    return <div className="GameBoard"><p>Run a round to see the results.</p></div>;
  }

  const { x, y, a, b, win } = lastRound;

  return (
    <div className="GameBoard">
      <h3>Last Round</h3>
      <p>Referee sends `x={x}` to Alice and `y={y}` to Bob.</p>
      <p>Alice outputs `a={a}`. Bob outputs `b={b}`.</p>
      <p>Win condition: `a + b (mod 2) === x * y`</p>
      <p>{`( ${a} + ${b} ) % 2 === ${x} * ${y}`}</p>
      <p>{(a + b) % 2} === {x * y}</p>
      <h4>Result: {win ? 'Win' : 'Loss'}</h4>
    </div>
  );
};

export default GameBoard;
