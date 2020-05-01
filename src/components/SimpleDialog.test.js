import React from 'react';
import { render } from 'test-utils';
import SimpleDialog from './SimpleDialog';

it('renders SimpleDialog without crashing', () => {
  render(<SimpleDialog open />);
});
