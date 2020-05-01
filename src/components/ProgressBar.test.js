import React from 'react';
import { render } from 'test-utils';
import ProgressBar from './ProgressBar';

it('renders ProgressBar without crashing', () => {
  render(<ProgressBar />);
});
