
import React from 'react';
import { CLASSICAL_STRATEGY } from '../../logic/constants';

const BellStateInfo = ({ strategy }) => {
  if (!strategy) return null;

  // Define the mathematical representation for each Bell state
  const bellStateFormulas = {
    '|Ψ-⟩': '(|01⟩ - |10⟩) / √2',
    '|Φ+⟩': '(|00⟩ + |11⟩) / √2',
    '|Φ-⟩': '(|00⟩ - |11⟩) / √2',
    '|Ψ+⟩': '(|01⟩ + |10⟩) / √2',
  };

  const formula = bellStateFormulas[strategy.name] || '';

  return (
    <div className="highlight-box">
      <p>Current State: <strong>{strategy.name}</strong></p>
      <p style={{ fontFamily: 'monospace', fontSize: '14px', margin: '8px 0' }}>
        {strategy.name} = {formula}
      </p>
      <p>This is a <strong>{strategy.correlation}</strong> outcome state.</p>
    </div>
  );
};

const Explanation = ({ strategyType, strategy }) => {

  const classicalText = (
    <div>
      <h4>Classical Strategy</h4>
      <p>
        Alice and Bob agree on a deterministic plan. The best such strategy can only win 75% of the time.
      </p>
    </div>
  );

  const quantumText = (
    <div>
      <BellStateInfo strategy={strategy} />
      <h4>Quantum Strategy</h4>
      <p>
        Alice and Bob use their shared entangled state and measure at angles optimized for that state:
      </p>
      <ul style={{ listStyleType: 'none', paddingLeft: '10px' }}>
        <li style={{ marginBottom: '8px' }}>
          <span style={{
            color: strategy.colors.alice[0],
            fontWeight: 'bold',
            fontSize: '16px',
            marginRight: '8px'
          }}>●</span>
          Alice (x=0): Measures at <strong>{strategy.angles.alice[0]}°</strong>
        </li>
        <li style={{ marginBottom: '8px' }}>
          <span style={{
            color: strategy.colors.alice[1],
            fontWeight: 'bold',
            fontSize: '16px',
            marginRight: '8px'
          }}>●</span>
          Alice (x=1): Measures at <strong>{strategy.angles.alice[1]}°</strong>
        </li>
        <li style={{ marginBottom: '8px' }}>
          <span style={{
            color: strategy.colors.bob[0],
            fontWeight: 'bold',
            fontSize: '16px',
            marginRight: '8px'
          }}>●</span>
          Bob (y=0): Measures at <strong>{strategy.angles.bob[0]}°</strong>
        </li>
        <li style={{ marginBottom: '8px' }}>
          <span style={{
            color: strategy.colors.bob[1],
            fontWeight: 'bold',
            fontSize: '16px',
            marginRight: '8px'
          }}>●</span>
          Bob (y=1): Measures at <strong>{strategy.angles.bob[1]}°</strong>
        </li>
      </ul>
      <p>
        By choosing the correct angles for the state, they can achieve a win-rate of ~<strong>85.4%</strong>, beating the classical limit. Try other Bell states to see how the measurement angles and win-rate change!
      </p>
    </div>
  );

  return (
    <div className="Explanation">
      <h3>How It Works</h3>
      {strategyType === CLASSICAL_STRATEGY ? classicalText : quantumText}

      {/* WordPress Link Card */}
      <div className="wordpress-card">
        <h4>Deep Dive on Quantum Entanglement</h4>
        <p>
          For a full, detailed breakdown of the quantum physics, math, and concepts behind this simulation, read our companion article.
        </p>
        <a 
          href="https://malcolmlow.com/2025/10/20/exploring-quantum-entanglement-chsh-game-simulator" 
          target="_blank" 
          rel="noopener noreferrer"
          className="wordpress-button"
        >
          Read on WordPress →
        </a>
      </div>
    </div>
  );
};

export default Explanation;
