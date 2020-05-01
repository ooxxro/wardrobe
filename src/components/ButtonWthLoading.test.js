import React from 'react';
import { render } from 'test-utils';
import ButtonWithLoading from './ButtonWithLoading';

it('renders ButtonWithLoading without crashing', () => {
  render(<ButtonWithLoading>test</ButtonWithLoading>);
});
