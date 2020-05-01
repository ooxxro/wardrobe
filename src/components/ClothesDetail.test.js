import React from 'react';
import { render } from 'test-utils';
import ClothesDetail from './ClothesDetail';
import userStore from '../stores/UserStore';

it('renders ClothesDetail without crashing', () => {
  // fake login
  userStore.setUser({
    uid: 'testUid',
    email: 'mocktest@wardrobe.rocks',
    displayName: 'Mock Test',
    photoURL: null,
  });
  render(<ClothesDetail />);
});
