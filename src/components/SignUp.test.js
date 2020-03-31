import React from 'react';
import { render } from 'test-utils';
import SignUp from './SignUp';

it('renders SignUp without crashing', () => {
  const { container } = render(<SignUp />);
  expect(container.innerHTML).toMatch('Sign up to Wardrobe');
});
