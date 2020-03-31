import React from 'react';
import { render } from 'test-utils';
import HomeWelcome from './HomeWelcome';

it('renders HomeWelcome with welcome message', () => {
  const { container } = render(<HomeWelcome />);
  expect(container.innerHTML).toMatch('Welcome to Wardrobe');
});
