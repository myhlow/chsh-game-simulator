import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

const VisualizationPanel = (props) => {
  const sketchRef = useRef();
  const sketchInstance = useRef(null);

  useEffect(() => {
    const sketch = (p) => {
      let internalProps = props;

      p.setup = () => {
        p.createCanvas(400, 450).parent(sketchRef.current);
        p.textAlign(p.CENTER, p.CENTER);
      };

      p.updateWithProps = (newProps) => {
        internalProps = newProps;
      };

      p.draw = () => {
        p.clear();
        p.background(240);
        const { strategyType, strategy, lastRound } = internalProps;

        // Draw only one combined visualization
        drawMeasurementSetup(p, strategyType, strategy, lastRound);
      };
    };

    sketchInstance.current = new p5(sketch);
    return () => {
      sketchInstance.current.remove();
    };
  }, []);

  useEffect(() => {
    if (sketchInstance.current) {
      sketchInstance.current.updateWithProps(props);
    }
  }, [props]);

  return <div ref={sketchRef}></div>;
};

// Helper drawing functions
const drawQuantumMeasurement = (p, x, y, a, b, win, strategy) => {
  const yStart = 230; // Increased from 210 to add spacing

  // Section titles
  p.fill(0);
  p.textSize(11);
  p.textAlign(p.CENTER, p.TOP);
  p.text('Entangled State', 65, yStart);
  p.text('After Alice', 195, yStart - 8); // Moved right for more space
  p.text('Measurement', 195, yStart + 4);
  p.text('After Bob', 315, yStart - 8); // Moved right for more space
  p.text('Measurement', 315, yStart + 4);

  // Draw each stage with more spacing
  drawEntangledPair(p, 65, yStart + 75); // Moved down for more space from title
  drawAliceMeasured(p, 195, yStart + 75, a, strategy.colors.alice[x], strategy.angles.alice[x], strategy, x, y);
  drawBobMeasured(p, 315, yStart + 75, b, strategy.colors.bob[y], strategy.angles.bob[y], strategy, y);

  // Show measurement outcomes below
  p.textSize(12);
  p.textAlign(p.CENTER, p.CENTER);
  p.fill(0);
  p.text(`Alice: a=${a}`, 195, yStart + 145); // Adjusted position
  p.text(`Bob: b=${b}`, 315, yStart + 145); // Adjusted position

  // Show win/loss result with prominent styling
  const resultY = yStart + 175;
  const resultX = p.width / 2;

  if (win) {
    // Draw background box
    p.fill(40, 167, 69, 50); // Semi-transparent green background
    p.noStroke();
    p.rect(resultX - 50, resultY - 18, 100, 36, 8);

    // Draw text
    p.fill('#28a745'); // Green for win
    p.textSize(22);
    p.textStyle(p.BOLD);
    p.text('✓ WIN', resultX, resultY);
    p.textStyle(p.NORMAL);
  } else {
    // Draw background box
    p.fill(220, 53, 69, 50); // Semi-transparent red background
    p.noStroke();
    p.rect(resultX - 50, resultY - 18, 100, 36, 8);

    // Draw text
    p.fill('#dc3545'); // Red for loss
    p.textSize(22);
    p.textStyle(p.BOLD);
    p.text('✗ LOSS', resultX, resultY);
    p.textStyle(p.NORMAL);
  }
};

const drawEntangledPair = (p, cx, cy) => {
  // Draw two qubits connected by entanglement
  const qubitRadius = 25; // Increased from 20
  const separation = 45; // Increased from 35

  // Left qubit (Alice's)
  p.fill(230);
  p.stroke(100);
  p.strokeWeight(2);
  p.ellipse(cx - separation/2, cy, qubitRadius * 2);

  // Right qubit (Bob's)
  p.ellipse(cx + separation/2, cy, qubitRadius * 2);

  // Entanglement connection
  p.stroke(150, 100, 200);
  p.strokeWeight(2);
  p.noFill();
  p.bezier(
    cx - separation/2, cy,
    cx - separation/2, cy - 15,
    cx + separation/2, cy - 15,
    cx + separation/2, cy
  );

  // Superposition indicators (question marks)
  p.fill(100);
  p.noStroke();
  p.textSize(20); // Increased from 16
  p.text('?', cx - separation/2, cy);
  p.text('?', cx + separation/2, cy);
};

const drawAliceMeasured = (p, cx, cy, a, color, angle, strategy, x, y) => {
  const qubitRadius = 25; // Match entangled state size
  const separation = 70; // Increased spacing between the two circles
  const toRad = (deg) => -deg * (Math.PI / 180); // Negative for counterclockwise

  // Determine if this is a Ψ state (orthogonal correlation)
  const isOrthogonal = strategy.name === '|Ψ+⟩' || strategy.name === '|Ψ-⟩';

  // Calculate Alice's qubit orientation
  const measurementAngle = toRad(angle);
  const aliceArrowAngle = a === 0 ? measurementAngle : measurementAngle - Math.PI / 2;

  // Calculate Bob's qubit orientation after Alice's measurement
  // For Φ states: Bob's qubit is in the same state as Alice's
  // For Ψ states: Bob's qubit is orthogonal (90° rotated) from Alice's
  const bobArrowAngle = isOrthogonal ? aliceArrowAngle - Math.PI / 2 : aliceArrowAngle;

  // Get Bob's measurement basis angle for the shading
  const bobMeasurementAngle = toRad(strategy.angles.bob[y]);

  // Draw Alice's qubit (left)
  const aliceCx = cx - separation / 2;

  // Draw Alice's qubit circle with lighter color
  p.fill(color);
  p.stroke(100);
  p.strokeWeight(2);
  p.ellipse(aliceCx, cy, qubitRadius * 2);

  // Draw Alice's measurement basis quadrant filled with lighter shade on top
  // Extract RGB values from color and make them lighter
  const c = p.color(color);
  const r = p.red(c) + (255 - p.red(c)) * 0.5;
  const g = p.green(c) + (255 - p.green(c)) * 0.5;
  const b = p.blue(c) + (255 - p.blue(c)) * 0.5;

  p.push();
  p.translate(aliceCx, cy);
  p.fill(r, g, b); // Lighter shade of the circle color
  p.noStroke();
  // Since toRad negates the angle, we subtract PI/2 to get +90° in anti-clockwise
  p.arc(0, 0, qubitRadius * 2, qubitRadius * 2, measurementAngle - Math.PI / 2, measurementAngle, p.PIE);
  p.pop();

  // Add labels "0" and "1" on the edges of Alice's quadrant
  const labelRadius = qubitRadius + 8;
  const angle0 = measurementAngle; // Edge at measurement angle (outcome 0)
  const angle1 = measurementAngle - Math.PI / 2; // Edge at measurement angle - 90° (outcome 1)

  p.fill(0);
  p.noStroke();
  p.textSize(10);
  p.textAlign(p.CENTER, p.CENTER);
  p.text('0', aliceCx + labelRadius * Math.cos(angle0), cy + labelRadius * Math.sin(angle0));
  p.text('1', aliceCx + labelRadius * Math.cos(angle1), cy + labelRadius * Math.sin(angle1));

  // Draw Alice's state arrow
  const arrowLength = 16; // Increased to match larger circles
  const aliceEndX = aliceCx + arrowLength * Math.cos(aliceArrowAngle);
  const aliceEndY = cy + arrowLength * Math.sin(aliceArrowAngle);
  p.fill(255);
  p.stroke(255);
  p.strokeWeight(2);
  p.line(aliceCx, cy, aliceEndX, aliceEndY);
  p.noStroke();
  p.fill(255);
  p.push();
  p.translate(aliceEndX, aliceEndY);
  p.rotate(aliceArrowAngle);
  p.triangle(0, 0, -6, -3, -6, 3); // Increased from -5, -2.5, -5, 2.5
  p.pop();

  // Draw Bob's qubit (right) - still uncollapsed but in a definite state
  const bobCx = cx + separation / 2;

  // Get Bob's measurement basis color
  const bobColor = strategy.colors.bob[y];

  // Draw Bob's qubit circle with Bob's measurement color
  p.fill(bobColor);
  p.stroke(100);
  p.strokeWeight(2);
  p.ellipse(bobCx, cy, qubitRadius * 2);

  // Draw Bob's measurement basis quadrant filled with lighter shade on top
  const bobC = p.color(bobColor);
  const bobR = p.red(bobC) + (255 - p.red(bobC)) * 0.5;
  const bobG = p.green(bobC) + (255 - p.green(bobC)) * 0.5;
  const bobB = p.blue(bobC) + (255 - p.blue(bobC)) * 0.5;

  p.push();
  p.translate(bobCx, cy);
  p.fill(bobR, bobG, bobB); // Lighter shade of Bob's measurement color
  p.noStroke();
  // Since toRad negates the angle, we subtract PI/2 to get +90° in anti-clockwise
  p.arc(0, 0, qubitRadius * 2, qubitRadius * 2, bobMeasurementAngle - Math.PI / 2, bobMeasurementAngle, p.PIE);
  p.pop();

  // Add labels "0" and "1" on the edges of Bob's quadrant
  const bobAngle0 = bobMeasurementAngle; // Edge at measurement angle (outcome 0)
  const bobAngle1 = bobMeasurementAngle - Math.PI / 2; // Edge at measurement angle - 90° (outcome 1)

  p.fill(0);
  p.noStroke();
  p.textSize(10);
  p.textAlign(p.CENTER, p.CENTER);
  p.text('0', bobCx + labelRadius * Math.cos(bobAngle0), cy + labelRadius * Math.sin(bobAngle0));
  p.text('1', bobCx + labelRadius * Math.cos(bobAngle1), cy + labelRadius * Math.sin(bobAngle1));

  // Draw Bob's state arrow
  const bobEndX = bobCx + arrowLength * Math.cos(bobArrowAngle);
  const bobEndY = cy + arrowLength * Math.sin(bobArrowAngle);
  p.fill(255);
  p.stroke(255);
  p.strokeWeight(2);
  p.line(bobCx, cy, bobEndX, bobEndY);
  p.noStroke();
  p.fill(255);
  p.push();
  p.translate(bobEndX, bobEndY);
  p.rotate(bobArrowAngle);
  p.triangle(0, 0, -6, -3, -6, 3); // Increased from -5, -2.5, -5, 2.5
  p.pop();

  // Label the qubits
  p.fill(0);
  p.noStroke();
  p.textSize(10);
  p.text('Alice', aliceCx, cy + qubitRadius + 14);
  p.text('Bob', bobCx, cy + qubitRadius + 14);

  // Show correlation type below
  p.textSize(8);
  p.fill(100);
  const corrText = isOrthogonal ? '(orthogonal)' : '(parallel)';
  p.text(corrText, cx, cy + qubitRadius + 28);
};

const drawBobMeasured = (p, cx, cy, b, color, angle, strategy, y) => {
  const qubitRadius = 25; // Match entangled state size
  const toRad = (deg) => -deg * (Math.PI / 180);

  // Get Bob's measurement basis angle
  const bobMeasurementAngle = toRad(strategy.angles.bob[y]);

  // Bob's qubit circle with color
  p.fill(color);
  p.stroke(100);
  p.strokeWeight(2);
  p.ellipse(cx, cy, qubitRadius * 2);

  // Draw Bob's measurement basis quadrant filled with lighter shade on top
  // Extract RGB values from color and make them lighter
  const c = p.color(color);
  const r = p.red(c) + (255 - p.red(c)) * 0.5;
  const g = p.green(c) + (255 - p.green(c)) * 0.5;
  const bl = p.blue(c) + (255 - p.blue(c)) * 0.5;

  p.push();
  p.translate(cx, cy);
  p.fill(r, g, bl); // Lighter shade of Bob's color
  p.noStroke();
  // Since toRad negates the angle, we subtract PI/2 to get +90° in anti-clockwise
  p.arc(0, 0, qubitRadius * 2, qubitRadius * 2, bobMeasurementAngle - Math.PI / 2, bobMeasurementAngle, p.PIE);
  p.pop();

  // Add labels "0" and "1" on the edges of Bob's quadrant
  const labelRadius = qubitRadius + 8;
  const bobAngle0 = bobMeasurementAngle; // Edge at measurement angle (outcome 0)
  const bobAngle1 = bobMeasurementAngle - Math.PI / 2; // Edge at measurement angle - 90° (outcome 1)

  p.fill(0);
  p.noStroke();
  p.textSize(10);
  p.textAlign(p.CENTER, p.CENTER);
  p.text('0', cx + labelRadius * Math.cos(bobAngle0), cy + labelRadius * Math.sin(bobAngle0));
  p.text('1', cx + labelRadius * Math.cos(bobAngle1), cy + labelRadius * Math.sin(bobAngle1));

  // Show measurement arrow in the direction of measurement
  // b=0 means arrow points in the direction of the measurement angle
  // b=1 means arrow points orthogonal (90° away, counterclockwise)
  const measurementAngle = toRad(angle);
  const arrowAngle = b === 0 ? measurementAngle : measurementAngle - Math.PI / 2;
  const arrowLength = 16; // Increased to match larger circles

  const endX = cx + arrowLength * Math.cos(arrowAngle);
  const endY = cy + arrowLength * Math.sin(arrowAngle);

  p.fill(255);
  p.stroke(255);
  p.strokeWeight(2);
  p.line(cx, cy, endX, endY);

  // Draw arrowhead
  p.noStroke();
  p.fill(255);
  p.push();
  p.translate(endX, endY);
  p.rotate(arrowAngle);
  p.triangle(0, 0, -6, -3, -6, 3); // Increased from -5, -2.5, -5, 2.5
  p.pop();

  // Label the qubit
  p.fill(0);
  p.noStroke();
  p.textSize(10);
  p.text('Bob', cx, cy + qubitRadius + 14);
};

const drawBasis = (p, cx, cy, r, angle, color, isInactive = false) => {
  p.push();
  p.translate(cx, cy);
  p.rotate(angle);

  if (isInactive) {
    // Draw inactive bases with reduced opacity and thinner lines
    const rgb = p.color(color);
    p.stroke(p.red(rgb), p.green(rgb), p.blue(rgb), 100); // 40% opacity
    p.strokeWeight(1.5);
    p.fill(p.red(rgb), p.green(rgb), p.blue(rgb), 100);
  } else {
    // Draw active bases with full opacity and thicker lines
    p.stroke(color);
    p.strokeWeight(3.5);
    p.fill(color);
  }

  // Draw arrow from center to edge (right angle, not full line)
  p.line(0, 0, r, 0);

  // Draw arrowhead
  const arrowSize = 8;
  p.noStroke();
  p.triangle(r, 0, r - arrowSize, -arrowSize/2, r - arrowSize, arrowSize/2);

  p.pop();
};

const drawMeasurementSetup = (p, strategyType, strategy, lastRound) => {
  p.fill(0);
  p.noStroke();
  p.textSize(16);

  if (strategyType === 'classical') {
    if (!lastRound) {
      p.text('Measurement Visualization', p.width / 2, 20);
      p.fill(150);
      p.textSize(14);
      p.text('Classical Mode: No quantum measurement', p.width / 2, 140);
      return;
    }

    const { x, y, a, b, win } = lastRound;
    p.text(`Classical Strategy (x=${x}, y=${y})`, p.width / 2, 20);

    p.fill(0);
    p.textSize(14);
    p.textAlign(p.LEFT, p.CENTER);
    p.text('Alice and Bob use predetermined outputs:', 50, 80);
    p.textSize(16);
    p.text(`Alice's output: a = ${a}`, 80, 110);
    p.text(`Bob's output: b = ${b}`, 80, 140);
    p.textSize(14);
    p.text('(Both always output 0 in this strategy)', 80, 170);

    // Show win/loss result
    p.textSize(18);
    if (win) {
      p.fill('#28a745'); // Green for win
      p.text('✓ WIN', 80, 210);
    } else {
      p.fill('#dc3545'); // Red for loss
      p.text('✗ LOSS', 80, 210);
    }

    p.textAlign(p.CENTER, p.CENTER);
    return;
  }

  if (!lastRound || !strategy) {
    p.text('Measurement Visualization', p.width / 2, 20);
    return;
  }

  // Show x and y values for this round
  const { x, y, a, b, win } = lastRound;
  p.text(`Quantum Strategy (x=${x}, y=${y})`, p.width / 2, 20);

  // Convert degrees to radians, negate to make angles go counterclockwise
  const toRad = (deg) => -deg * (Math.PI / 180);

  const cx = 280; // Moved right to avoid overlap
  const cy = 100;
  const radius = 50;

  // Draw reference axes
  p.stroke(200);
  p.strokeWeight(1);
  p.line(cx - radius, cy, cx + radius, cy);
  p.line(cx, cy - radius, cx, cy + radius);

  // Draw circle
  p.noFill();
  p.stroke(180);
  p.ellipse(cx, cy, radius * 2, radius * 2);

  // Draw angle labels around the circle
  p.fill(150);
  p.noStroke();
  p.textSize(9);
  const labelRadius = radius + 12;
  const angles = [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, -157.5, -135, -112.5, -90, -67.5, -45, -22.5];
  angles.forEach(deg => {
    const rad = toRad(deg);
    const lx = cx + labelRadius * Math.cos(rad);
    const ly = cy + labelRadius * Math.sin(rad);
    p.text(`${deg}°`, lx, ly);
  });

  // Draw center point
  p.fill(100);
  p.noStroke();
  p.quad(cx, cy - 8, cx + 8, cy, cx, cy + 8, cx - 8, cy);

  // Draw all four measurement bases with their colors
  // Alice's bases
  const aliceAngle0 = toRad(strategy.angles.alice[0]);
  const aliceAngle1 = toRad(strategy.angles.alice[1]);
  const aliceColor0 = strategy.colors.alice[0];
  const aliceColor1 = strategy.colors.alice[1];

  // Bob's bases
  const bobAngle0 = toRad(strategy.angles.bob[0]);
  const bobAngle1 = toRad(strategy.angles.bob[1]);
  const bobColor0 = strategy.colors.bob[0];
  const bobColor1 = strategy.colors.bob[1];

  // Draw non-active bases with reduced opacity
  drawBasis(p, cx, cy, radius, aliceAngle0, aliceColor0, x !== 0);
  drawBasis(p, cx, cy, radius, aliceAngle1, aliceColor1, x !== 1);
  drawBasis(p, cx, cy, radius, bobAngle0, bobColor0, y !== 0);
  drawBasis(p, cx, cy, radius, bobAngle1, bobColor1, y !== 1);

  // Draw legend
  p.textAlign(p.LEFT, p.CENTER);
  p.noStroke();
  p.textSize(11);

  const legendX = 10;
  const legendY = 50;
  const lineHeight = 18;

  p.fill(aliceColor0);
  p.text(`Alice x=0: ${strategy.angles.alice[0]}°`, legendX, legendY);
  if (x === 0) {
    p.text('← ACTIVE', legendX + 110, legendY);
  }

  p.fill(aliceColor1);
  p.text(`Alice x=1: ${strategy.angles.alice[1]}°`, legendX, legendY + lineHeight);
  if (x === 1) {
    p.text('← ACTIVE', legendX + 110, legendY + lineHeight);
  }

  p.fill(bobColor0);
  p.text(`Bob y=0: ${strategy.angles.bob[0]}°`, legendX, legendY + lineHeight * 2);
  if (y === 0) {
    p.text('← ACTIVE', legendX + 110, legendY + lineHeight * 2);
  }

  p.fill(bobColor1);
  p.text(`Bob y=1: ${strategy.angles.bob[1]}°`, legendX, legendY + lineHeight * 3);
  if (y === 1) {
    p.text('← ACTIVE', legendX + 110, legendY + lineHeight * 3);
  }

  // Show relative angle between active bases
  const activeAliceAngle = strategy.angles.alice[x];
  const activeBobAngle = strategy.angles.bob[y];
  const isOrthogonal = strategy.name === '|Ψ+⟩' || strategy.name === '|Ψ-⟩';

  // For orthogonal states, add 90° to account for Bob's qubit being orthogonal to Alice's
  const relativeAngle = activeBobAngle - activeAliceAngle;
  const effectiveAngle = isOrthogonal ? relativeAngle + 90 : relativeAngle;
  const deltaRad = effectiveAngle * (Math.PI / 180);

  p.fill(0);
  p.textSize(12);

  if (isOrthogonal) {
    p.text(`Alice's measurement: ${activeAliceAngle.toFixed(1)}°`, legendX, legendY + lineHeight * 4.5);
    p.text(`Bob's measurement: ${activeBobAngle.toFixed(1)}°`, legendX, legendY + lineHeight * 5.3);
    p.fill(150, 0, 150);
    p.textSize(10);
    p.text(`Bob's qubit is orthogonal to Alice's (+90°)`, legendX, legendY + lineHeight * 6.1);
    p.fill(0);
    p.textSize(12);
    p.text(`Effective δ: ${relativeAngle.toFixed(1)}° + 90° = ${effectiveAngle.toFixed(1)}°`, legendX, legendY + lineHeight * 7);
  } else {
    p.text(`Relative Angle δ: ${relativeAngle.toFixed(1)}°`, legendX, legendY + lineHeight * 4.5);
  }

  // Calculate and display correlation values using cos²(δ)
  const probSame = Math.pow(Math.cos(deltaRad), 2);
  const probDiff = Math.pow(Math.sin(deltaRad), 2);

  p.textSize(10);
  p.fill(60);
  const yOffset = isOrthogonal ? 7.8 : 5.5;
  p.text(`P(same) = cos²(${effectiveAngle.toFixed(1)}°) = ${(probSame * 100).toFixed(1)}%`, legendX, legendY + lineHeight * yOffset);
  p.text(`P(diff) = sin²(${effectiveAngle.toFixed(1)}°) = ${(probDiff * 100).toFixed(1)}%`, legendX, legendY + lineHeight * (yOffset + 0.8));

  // Draw measurement results and qubit state visualization
  p.textAlign(p.CENTER, p.CENTER);

  // Draw entangled state representation and measurement outcomes
  drawQuantumMeasurement(p, x, y, a, b, win, strategy);
};

const drawCollapsedState = (p, strategyType, lastRound) => {
  p.fill(0);
  p.noStroke();
  p.textSize(16);
  p.text('2. Collapsed State', p.width / 2, 240);

  if (strategyType === 'classical' || !lastRound) {
    p.fill(150);
    p.textSize(14);
    p.text('N/A for Classical Mode', p.width / 2, 330);
    return;
  }

  const { a, b } = lastRound;
  drawOutcome(p, 'Alice\'s Outcome', 100, 330, a);
  drawOutcome(p, 'Bob\'s Outcome', 300, 330, b);
};

const drawOutcome = (p, name, cx, cy, outcome) => {
  const radius = 50;
  const spin = outcome === 0 ? 1 : -1;
  const outcomeText = spin === 1 ? 'Spin Up' : 'Spin Down';

  p.push();
  p.translate(cx, cy);
  p.fill(0);
  p.noStroke();
  p.textSize(14);
  p.text(name, 0, -radius - 20);
  p.noFill();
  p.stroke(180);
  p.ellipse(0, 0, radius * 2, radius * 2);

  p.strokeWeight(3);
  p.stroke('#d9534f');
  p.fill('#d9534f');
  p.line(0, 0, 0, -radius * 0.6 * spin);
  p.push();
  p.translate(0, -radius * 0.6 * spin);
  p.triangle(-4, 0, 4, 0, 0, -8 * spin);
  p.pop();

  p.fill(0);
  p.noStroke();
  p.textSize(12);
  p.text(outcomeText, 0, radius + 15);

  p.pop();
};

export default VisualizationPanel;