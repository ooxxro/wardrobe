import React from 'react';
import { render } from 'test-utils';
import Layout from './Layout';

it('renders Layout without crashing', () => {
  const { container } = render(<Layout />);
  expect(container.innerHTML).toMatch('All Rights Reserve');
});
