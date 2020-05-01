import React from 'react';
import { render } from 'test-utils';
import MyFavoritesEdit from './MyFavoritesEdit';
import userStore from '../stores/UserStore';

it('renders MyFavoritesEdit without crashing', () => {
  // fake login
  userStore.setUser({
    uid: 'testUid',
    email: 'mocktest@wardrobe.rocks',
    displayName: 'Mock Test',
    photoURL: null,
  });
  render(<MyFavoritesEdit />);
});
