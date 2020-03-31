import React from 'react';
import { render } from 'test-utils';
import Login from './Login';

it('renders Login without crashing', () => {
  const { container } = render(<Login />);
  expect(container.innerHTML).toMatch('Login to Wardrobe');
});
