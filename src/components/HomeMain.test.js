import React from 'react';
import { render } from 'test-utils';
import HomeMain from './HomeMain';

it('renders HomeMain without crashing', () => {
  render(<HomeMain />);
});
