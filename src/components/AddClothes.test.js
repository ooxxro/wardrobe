import React from 'react';
import { render } from 'test-utils';
import AddClothes from './AddClothes';

it('renders AddClothes without crashing', () => {
  const { container } = render(<AddClothes />);
  expect(container.innerHTML).toMatch('Add clothes');
});
