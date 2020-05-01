import React from 'react';
import { render } from 'test-utils';
import Random from './Random';
import userStore from '../stores/UserStore';

it('renders Random without crashing', () => {
  // fake login
  userStore.setUser({
    uid: 'testUid',
    email: 'mocktest@wardrobe.rocks',
    displayName: 'Mock Test',
    photoURL: null,
  });
  render(<Random />);
});
