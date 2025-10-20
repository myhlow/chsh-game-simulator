
// src/components/CHSHGame/index.js
import React, { useState, useCallback } from 'react';
import Controls from '../Controls';
import Scoreboard from '../Scoreboard';
import VisualizationPanel from '../Visualization/VisualizationPanel';
import Explanation from '../Explanation';
import { runCHSHRound } from '../../logic/chsh';
import { CLASSICAL_STRATEGY, BELL_STATES } from '../../logic/constants';
import { STRATEGIES } from '../../logic/strategies';
import './styles.css';

const CHSHGame = () => {
  const [strategyType, setStrategyType] = useState(CLASSICAL_STRATEGY);
  const [bellState, setBellState] = useState(BELL_STATES['Φ+']);
  const [xInput, setXInput] = useState('random');
  const [yInput, setYInput] = useState('random');
  const [scores, setScores] = useState({ roundsPlayed: 0, wins: 0, losses: 0, winPercentage: 0 });
  const [roundHistory, setRoundHistory] = useState([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);

  const strategyObject = STRATEGIES[bellState];
  const displayedRound = currentHistoryIndex >= 0 ? roundHistory[currentHistoryIndex] : null;

  const handleRun = useCallback((numRounds) => {
    let currentWins = scores.wins;
    let currentRounds = scores.roundsPlayed;
    const newRounds = [];

    for (let i = 0; i < numRounds; i++) {
      const result = runCHSHRound(strategyType, bellState, xInput, yInput);
      if (result.win) {
        currentWins++;
      }
      currentRounds++;
      newRounds.push(result);
    }

    setScores({
      roundsPlayed: currentRounds,
      wins: currentWins,
      losses: currentRounds - currentWins,
      winPercentage: (currentWins / currentRounds) * 100,
    });

    // Keep only last 100 rounds
    setRoundHistory(prev => {
      const updated = [...prev, ...newRounds];
      return updated.slice(-100);
    });

    // Set current index to the last round
    setCurrentHistoryIndex(prev => {
      const newLength = Math.min(roundHistory.length + newRounds.length, 100);
      return newLength - 1;
    });

  }, [strategyType, bellState, xInput, yInput, scores, roundHistory.length]);

  const handlePrevious = useCallback(() => {
    setCurrentHistoryIndex(prev => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentHistoryIndex(prev => Math.min(roundHistory.length - 1, prev + 1));
  }, [roundHistory.length]);

  return (
    <div className="CHSHGame">
      <h1>CHSH Game Simulator</h1>
      <div className="main-layout-3-col">
        <div className="panel">
          <Controls
            strategy={strategyType}
            setStrategy={setStrategyType}
            bellState={bellState}
            setBellState={setBellState}
            xInput={xInput}
            setXInput={setXInput}
            yInput={yInput}
            setYInput={setYInput}
            onRun={handleRun}
          />
          <Scoreboard scores={scores} />
        </div>
        <div className="panel">
          {roundHistory.length > 0 && (
            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
              <button
                onClick={handlePrevious}
                disabled={currentHistoryIndex <= 0}
                style={{ marginRight: '10px', padding: '5px 15px' }}
              >
                ← Previous
              </button>
              <span style={{ margin: '0 10px', fontWeight: 'bold' }}>
                Round {currentHistoryIndex + 1} of {roundHistory.length}
              </span>
              <button
                onClick={handleNext}
                disabled={currentHistoryIndex >= roundHistory.length - 1}
                style={{ marginLeft: '10px', padding: '5px 15px' }}
              >
                Next →
              </button>
            </div>
          )}
          <VisualizationPanel
            lastRound={displayedRound}
            strategyType={strategyType}
            strategy={strategyObject}
          />
        </div>
        <div className="panel">
          <Explanation strategyType={strategyType} strategy={strategyObject} />
        </div>
      </div>
    </div>
  );
};

export default CHSHGame;
