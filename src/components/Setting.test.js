import React from 'react';
import { render } from 'test-utils';
import Setting from './Setting';
import userStore from '../stores/UserStore';

it('renders Setting without crashing', () => {
  // mock userStore login
  userStore.setUser({
    uid: 'testUid',
    email: 'mocktest@wardrobe.rocks',
    displayName: 'Mock Test',
    photoURL: null,
  });

  const { container } = render(<Setting />);
  expect(container.innerHTML).toMatch('Settings');
});
