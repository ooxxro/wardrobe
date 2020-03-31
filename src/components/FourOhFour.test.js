import React from 'react';
import { render } from 'test-utils';
import FourOhFour from './FourOhFour';

it('renders FourOhFour without crashing', () => {
  const { container } = render(<FourOhFour />);
  expect(container.innerHTML).toMatch('404 Not Found');
});
