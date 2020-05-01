import React from 'react';
import { render, fireEvent } from 'test-utils';
import Setting from './Setting';
import userStore from '../stores/UserStore';
import { /*getByLabelText,*/ queryByAttribute, getByText } from '@testing-library/dom';
//import firebase from '../firebase';

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

/*it('changes display name successfully', () => {
  // mock userStore login
  userStore.setUser({
    uid: 'testUid',
    email: 'mocktest@wardrobe.rocks',
    displayName: 'Mock Test',
    photoURL: null,
  });

  const { container } = render(<Setting />);

  const getById = queryByAttribute.bind(null, 'id');

  //Fill out display name form and hit submit button
  fireEvent.change(getByLabelText(container, 'Display Name'), {
    target: { value: 'newname' },
  });

  fireEvent.click(getById(container, 'displayNameSubmit'));

  expect(userStore.currentUser.displayName).toMatch('newname');
});*/

it('shows edit avatar form when user clicks avatar icon', () => {
  const { container } = render(<Setting />);
  const getById = queryByAttribute.bind(null, 'id');
  fireEvent.click(getById(container, 'avatarIcon'));
  expect(getById(container, 'editAvatarForm')).toHaveStyle(`display: block`);
});

it('hides edit avatar form when user clicks cancel button on it', () => {
  const { container } = render(<Setting />);
  const getById = queryByAttribute.bind(null, 'id');
  fireEvent.click(getById(container, 'avatarIcon'));
  fireEvent.click(getByText(container, 'CANCEL'));
  expect(getById(container, 'editAvatarForm')).toHaveStyle(`display: none`);
});
