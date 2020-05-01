import React from 'react';
import { render } from 'test-utils';
import Warning from './Warning';

it('renders Warning without crashing', () => {
  render(<Warning />);
});
