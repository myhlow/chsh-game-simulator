
// src/logic/chsh.js


import { STRATEGIES } from './strategies';
import { CLASSICAL_STRATEGY } from './constants';

// Alice and Bob always output 0. This wins 75% of the time.
const classicalStrategy = (x, y) => {
  const a = 0;
  const b = 0;
  return { a, b };
};


// This function now uses the strategy object to get the correct angles and expectation value
const getQuantumOutputs = (x, y, strategy) => {
  const toRad = (deg) => deg * (Math.PI / 180);

  const aliceAngle = toRad(strategy.angles.alice[x]);
  const bobAngle = toRad(strategy.angles.bob[y]);

  // For orthogonally correlated states (Ψ+ and Ψ-), Bob's qubit is rotated 90° from Alice's
  // So we need to add 90° to the delta calculation
  let delta = aliceAngle - bobAngle;
  if (strategy.name === '|Ψ+⟩' || strategy.name === '|Ψ-⟩') {
    delta = delta + toRad(90);
  }

  // Quantum mechanical probability for CHSH: P(same) = cos²(δ)
  const prob_same_outcome = Math.pow(Math.cos(delta), 2);

  const a_outcome = Math.random() < 0.5 ? 0 : 1;
  let b_outcome;

  if (Math.random() < prob_same_outcome) {
    b_outcome = a_outcome; // Outcomes are the same
  } else {
    b_outcome = 1 - a_outcome; // Outcomes are different
  }

  return { a: a_outcome, b: b_outcome };
};

export const runCHSHRound = (strategyType, bellState, xInput = 'random', yInput = 'random') => {
  const x = xInput === 'random' ? Math.round(Math.random()) : parseInt(xInput);
  const y = yInput === 'random' ? Math.round(Math.random()) : parseInt(yInput);

  let outputs;
  if (strategyType === CLASSICAL_STRATEGY) {
    outputs = classicalStrategy(x, y);
  } else {
    const strategy = STRATEGIES[bellState];
    outputs = getQuantumOutputs(x, y, strategy);
  }

  const { a, b } = outputs;
  const win = (a + b) % 2 === x * y;

  return { x, y, a, b, win };
};
