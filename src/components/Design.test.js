import React from 'react';
import { render } from 'test-utils';
import Design from './Design';
import userStore from '../stores/UserStore';

it('renders Design without crashing', () => {
  // fake login
  userStore.setUser({
    uid: 'testUid',
    email: 'mocktest@wardrobe.rocks',
    displayName: 'Mock Test',
    photoURL: null,
  });
  render(<Design />);
});
