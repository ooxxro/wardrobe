import React from 'react';
import { render } from 'test-utils';
import Setting from './Setting';

it('renders Setting without crashing', () => {
  const { container } = render(<Setting />);
  expect(container.innerHTML).toMatch('Settings');
});
