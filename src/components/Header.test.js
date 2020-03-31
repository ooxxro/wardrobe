import React from 'react';
import { render } from 'test-utils';
import Header from './Header';

it('renders Header without crashing', () => {
  const { getByText } = render(<Header />);
  expect(getByText(/wardrobe/i)).toBeInTheDocument();
});

// it('renders Header buttons for logged in and logged out users', () => {
//   // fake logout
//   userStore.currentUser = null;
//   const { container, getByText } = render(<Header />);

//   expect(getByText(/login/i)).toBeInTheDocument();
//   expect(getByText(/sign up/i)).toBeInTheDocument();
//   expect(container.querySelector('.ant-avatar')).not.toBeInTheDocument();

//   // fake login
//   act(() => {
//     userStore.currentUser = {
//       displayName: 'Bucky Badger',
//       email: 'bucky@wisc.edu',
//     };
//   });

//   expect(getByText(/login/i)).not.toBeInTheDocument();
//   expect(getByText(/sign up/i)).not.toBeInTheDocument();
//   expect(container.querySelector('.ant-avatar')).toBeInTheDocument();
// });
