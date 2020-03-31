import React from 'react';
import { render } from 'test-utils';
import MyWardrobe from './MyWardrobe';

it('renders MyWardrobe without crashing', () => {
  const { container } = render(<MyWardrobe />);
  expect(container.innerHTML).toMatch('My wardrobe');
  expect(container.innerHTML).toMatch('Add Clothes');
  expect(container.innerHTML).toMatch('ALL');
  expect(container.innerHTML).toMatch('Hats');
  expect(container.innerHTML).toMatch('Shirts');
  expect(container.innerHTML).toMatch('Pants');
  expect(container.innerHTML).toMatch('Shoes');
});
