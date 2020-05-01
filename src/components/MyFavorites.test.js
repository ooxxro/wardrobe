import React from 'react';
import { render } from 'test-utils';
import MyFavorites from './MyFavorites';
import userStore from '../stores/UserStore';

it('renders MyFavorites without crashing', () => {
  // fake login
  userStore.setUser({
    uid: 'testUid',
    email: 'mocktest@wardrobe.rocks',
    displayName: 'Mock Test',
    photoURL: null,
  });
  render(<MyFavorites />);
});
