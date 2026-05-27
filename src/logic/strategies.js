
import { BELL_STATES } from './constants';

// Color scheme for measurement bases
export const BASIS_COLORS = {
  alice_x0: '#dc3545',  // Red for Alice x=0
  alice_x1: '#007bff',  // Blue for Alice x=1
  bob_y0: '#fd7e14',    // Orange for Bob y=0
  bob_y1: '#28a745',    // Green for Bob y=1
};

// Defines the optimal measurement strategy for each Bell state to maximally violate the CHSH inequality.
//
// Bob's angles are pre-rotated +90° for all states except |Φ+⟩, which uses the standard
// textbook values. The `orthogonalCorrection` flag tells chsh.js to add an additional
// 90° to the effective delta when computing P(same) = cos²(δ). Together the two 90°
// shifts cancel for the Φ-/Ψ states and yield the same optimal deltas as |Φ+⟩.
// |Φ+⟩ is the reference: no rotation in Bob's angles, no correction flag.
export const STRATEGIES = {
  [BELL_STATES['Φ+']]: {
    name: '|Φ+⟩',
    correlation: 'Same',
    orthogonalCorrection: false,
    // Standard textbook CHSH angles — no correction needed.
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
    orthogonalCorrection: true,
    // Bob's angles rotated +90° from the standard values. chsh.js adds another
    // 90° via orthogonalCorrection, giving effective deltas identical to |Φ+⟩.
    angles: {
      alice: [0, 45],
      bob: [112.5, 67.5],
    },
    colors: {
      alice: [BASIS_COLORS.alice_x0, BASIS_COLORS.alice_x1],
      bob: [BASIS_COLORS.bob_y0, BASIS_COLORS.bob_y1],
    },
  },
  [BELL_STATES['Ψ+']]: {
    name: '|Ψ+⟩',
    correlation: 'Same',
    orthogonalCorrection: true,
    // Orthogonally correlated state — Bob's angles rotated +90°.
    angles: {
      alice: [0, 45],
      bob: [112.5, 67.5],
    },
    colors: {
      alice: [BASIS_COLORS.alice_x0, BASIS_COLORS.alice_x1],
      bob: [BASIS_COLORS.bob_y0, BASIS_COLORS.bob_y1],
    },
  },
  [BELL_STATES['Ψ-']]: {
    name: '|Ψ-⟩',
    correlation: 'Opposite',
    orthogonalCorrection: true,
    // Orthogonally correlated state — Bob's angles rotated +90°.
    angles: {
      alice: [0, 45],
      bob: [112.5, 67.5],
    },
    colors: {
      alice: [BASIS_COLORS.alice_x0, BASIS_COLORS.alice_x1],
      bob: [BASIS_COLORS.bob_y0, BASIS_COLORS.bob_y1],
    },
  },
};
