
// src/components/Controls/index.js
import React from 'react';
import { CLASSICAL_STRATEGY, QUANTUM_STRATEGY, BELL_STATES } from '../../logic/constants';

const Controls = ({ strategy, setStrategy, bellState, setBellState, xInput, setXInput, yInput, setYInput, onRun }) => {
  return (
    <div className="Controls">
      <h3>Controls</h3>
      <div>
        <label>Strategy:</label>
        <select value={strategy} onChange={(e) => setStrategy(e.target.value)}>
          <option value={CLASSICAL_STRATEGY}>Classical</option>
          <option value={QUANTUM_STRATEGY}>Quantum</option>
        </select>
      </div>
      {strategy === QUANTUM_STRATEGY && (
        <div>
          <label>Bell State:</label>
          <select value={bellState} onChange={(e) => setBellState(e.target.value)}>
            {Object.keys(BELL_STATES).map((name) => (
              <option key={BELL_STATES[name]} value={BELL_STATES[name]}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label>Alice's input (x):</label>
        <select value={xInput} onChange={(e) => setXInput(e.target.value)}>
          <option value="random">Random</option>
          <option value="0">0</option>
          <option value="1">1</option>
        </select>
      </div>
      <div>
        <label>Bob's input (y):</label>
        <select value={yInput} onChange={(e) => setYInput(e.target.value)}>
          <option value="random">Random</option>
          <option value="0">0</option>
          <option value="1">1</option>
        </select>
      </div>
      <div>
        <button onClick={() => onRun(1)}>Run 1 Round</button>
        <button onClick={() => onRun(10)}>Run 10 Rounds</button>
        <button onClick={() => onRun(100)}>Run 100 Rounds</button>
      </div>
    </div>
  );
};

export default Controls;
