// src/logic/chsh.test.js

import { runCHSHRound } from './chsh';
import { CLASSICAL_STRATEGY, QUANTUM_STRATEGY, BELL_STATES } from './constants';

// ─── Shared helpers ────────────────────────────────────────────────────────────

const winRate = (strategy, bellState, n = 10_000) => {
  let wins = 0;
  for (let i = 0; i < n; i++) {
    if (runCHSHRound(strategy, bellState).win) wins++;
  }
  return wins / n;
};

// ─── Classical strategy ────────────────────────────────────────────────────────

describe('Classical strategy', () => {
  test('win condition matches (a + b) mod 2 === x * y on every round', () => {
    for (let i = 0; i < 200; i++) {
      const { x, y, a, b, win } = runCHSHRound(CLASSICAL_STRATEGY, BELL_STATES['Φ+']);
      expect(win).toBe((a + b) % 2 === x * y);
    }
  });

  test('always outputs a = 0 and b = 0', () => {
    for (let i = 0; i < 200; i++) {
      const { a, b } = runCHSHRound(CLASSICAL_STRATEGY, BELL_STATES['Φ+']);
      expect(a).toBe(0);
      expect(b).toBe(0);
    }
  });

  test('wins on every input pair except (x=1, y=1)', () => {
    // With a = b = 0: win iff x * y === 0, so the only losing case is x = y = 1.
    const cases = [
      { x: '0', y: '0', expectedWin: true },
      { x: '0', y: '1', expectedWin: true },
      { x: '1', y: '0', expectedWin: true },
      { x: '1', y: '1', expectedWin: false },
    ];
    cases.forEach(({ x, y, expectedWin }) => {
      const { win } = runCHSHRound(CLASSICAL_STRATEGY, BELL_STATES['Φ+'], x, y);
      expect(win).toBe(expectedWin);
    });
  });

  test('converges to ~75% win rate over 10 000 rounds (tolerance ±3%)', () => {
    const rate = winRate(CLASSICAL_STRATEGY, BELL_STATES['Φ+']);
    expect(rate).toBeGreaterThan(0.72);
    expect(rate).toBeLessThan(0.78);
  });
});

// ─── Quantum strategy ──────────────────────────────────────────────────────────

describe('Quantum strategy', () => {
  test('outputs are valid bits on every round', () => {
    for (let i = 0; i < 200; i++) {
      const { x, y, a, b } = runCHSHRound(QUANTUM_STRATEGY, BELL_STATES['Φ+']);
      expect([0, 1]).toContain(x);
      expect([0, 1]).toContain(y);
      expect([0, 1]).toContain(a);
      expect([0, 1]).toContain(b);
    }
  });

  test('win condition matches (a + b) mod 2 === x * y on every round', () => {
    for (let i = 0; i < 200; i++) {
      const { x, y, a, b, win } = runCHSHRound(QUANTUM_STRATEGY, BELL_STATES['Φ+']);
      expect(win).toBe((a + b) % 2 === x * y);
    }
  });

  test('fixed inputs are respected', () => {
    for (let i = 0; i < 100; i++) {
      const { x, y } = runCHSHRound(QUANTUM_STRATEGY, BELL_STATES['Φ+'], '0', '1');
      expect(x).toBe(0);
      expect(y).toBe(1);
    }
  });

  test.each([
    ['Φ+', BELL_STATES['Φ+']],
    ['Φ-', BELL_STATES['Φ-']],
    ['Ψ+', BELL_STATES['Ψ+']],
    ['Ψ-', BELL_STATES['Ψ-']],
  ])(
    '|%s⟩ converges to ~85.4%% win rate over 10 000 rounds (tolerance ±3%%)',
    (_name, bellState) => {
      const rate = winRate(QUANTUM_STRATEGY, bellState);
      expect(rate).toBeGreaterThan(0.824);
      expect(rate).toBeLessThan(0.884);
    }
  );

  test('all Bell states beat the classical 75% ceiling', () => {
    Object.values(BELL_STATES).forEach(bellState => {
      const rate = winRate(QUANTUM_STRATEGY, bellState);
      expect(rate).toBeGreaterThan(0.75);
    });
  });
});
