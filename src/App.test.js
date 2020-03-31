import React from 'react';
import { render, renderWithRouter, fireEvent } from 'test-utils';
import App from './App';

test('full app rendering/navigating home/login/signup', () => {
  const { container, getAllByText } = render(<App />);
  // verify page content for expected route
  // often you'd use a data-testid or role query, but this is also possible
  expect(container.innerHTML).toMatch('Welcome to Wardrobe');

  // go to login
  fireEvent.click(getAllByText(/login/i)[0]);
  expect(container.innerHTML).toMatch('Login to Wardrobe');

  // go back home
  fireEvent.click(getAllByText(/Wardrobe/i)[0]);
  expect(container.innerHTML).toMatch('Welcome to Wardrobe');

  // go to signup
  fireEvent.click(getAllByText(/sign up/i)[0]);
  expect(container.innerHTML).toMatch('Sign up to Wardrobe');
});

test('landing on a bad url shows 404 page', () => {
  const { container } = renderWithRouter(<App />, {
    route: '/something-that-does-not-match',
  });
  expect(container.innerHTML).toMatch('404 Not Found');
});
