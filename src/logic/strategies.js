
import { BELL_STATES } from './constants';

// Color scheme for measurement bases
export const BASIS_COLORS = {
  alice_x0: '#dc3545',  // Red for Alice x=0
  alice_x1: '#007bff',  // Blue for Alice x=1
  bob_y0: '#fd7e14',    // Orange for Bob y=0
  bob_y1: '#28a745',    // Green for Bob y=1
};

// Defines the optimal measurement strategy for each Bell state to maximally violate the CHSH inequality.
export const STRATEGIES = {
  [BELL_STATES['Ψ-']]: {
    name: '|Ψ-⟩',
    correlation: 'Opposite',
    // Orthogonally correlated state
    // Bob's angles: y=0 at 112.5°, y=1 at 67.5°
    angles: {
      alice: [0, 45], // [x=0, x=1]
      bob: [112.5, 67.5], // [y=0, y=1] - rotated +90° from [22.5, -22.5]
    },
    colors: {
      alice: [BASIS_COLORS.alice_x0, BASIS_COLORS.alice_x1],
      bob: [BASIS_COLORS.bob_y0, BASIS_COLORS.bob_y1],
    },
  },
  [BELL_STATES['Φ+']]: {
    name: '|Φ+⟩',
    correlation: 'Same',
    // Optimal CHSH angles (standard textbook values)
    angles: {
      alice: [0, 45],
      bob: [22.5, -22.5], // y=0: 22.5°, y=1: -22.5°
    },
    colors: {
      alice: [BASIS_COLORS.alice_x0, BASIS_COLORS.alice_x1],
      bob: [BASIS_COLORS.bob_y0, BASIS_COLORS.bob_y1],
    },
  },
  [BELL_STATES['Φ-']]: {
    name: '|Φ-⟩',
    correlation: 'Opposite',
    // Anti-correlated state
    // Rotate Bob's angles by 90° to convert opposite→same correlation
    angles: {
      alice: [0, 45],
      bob: [112.5, 67.5], // rotated +90° from [22.5, -22.5]
    },
    colors: {
      alice: [BASIS_COLORS.alice_x0, BASIS_COLORS.alice_x1],
      bob: [BASIS_COLORS.bob_y0, BASIS_COLORS.bob_y1],
    },
  },
  [BELL_STATES['Ψ+']]: {
    name: '|Ψ+⟩',
    correlation: 'Same',
    // Orthogonally correlated state
    // Bob's angles: y=0 at 112.5°, y=1 at 67.5°
    angles: {
      alice: [0, 45],
      bob: [112.5, 67.5], // [y=0, y=1] - rotated +90° from [22.5, -22.5]
    },
    colors: {
      alice: [BASIS_COLORS.alice_x0, BASIS_COLORS.alice_x1],
      bob: [BASIS_COLORS.bob_y0, BASIS_COLORS.bob_y1],
    },
  },
};
