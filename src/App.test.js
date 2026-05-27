// src/App.test.js
// Logic tests live in src/logic/chsh.test.js.
// This file is intentionally minimal — the simulator has no static text to
// assert on and the meaningful coverage is in the pure logic layer.

import { render } from '@testing-library/react';
import App from './App';

test('renders without crashing', () => {
  render(<App />);
});
