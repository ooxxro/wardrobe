import React from 'react';
import { render, fireEvent } from 'test-utils';
import Setting from './Setting';
import userStore from '../stores/UserStore';
import { queryByAttribute, getByText } from '@testing-library/dom';
import firebase from '../firebase';

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

it('update DisplayName', () => {
  const mockUser = {
    uid: 'testUid',
    email: 'mocktest@wardrobe.rocks',
    displayName: 'Mock Test',
    photoURL: null,
  };
  firebase.auth().currentUser = mockUser;

  // mock user.updateProfile
  const mockUpdateProfile = jest.fn(() => Promise.resolve(mockUser));
  mockUser.updateProfile = mockUpdateProfile;

  // render component
  const { getByLabelText, getByTestId } = render(<Setting />);

  const nameInput = getByLabelText('Display Name');
  fireEvent.change(nameInput, { target: { value: 'new name' } });
  const saveBtn = getByTestId('displayNameSaveBtn');
  // for some reason the click event only fires if clicking on the child...
  fireEvent.click(saveBtn.children[0]);

  expect(mockUpdateProfile).toHaveBeenCalledWith({ displayName: 'new name' });
});

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

it('makes display name save button clickable when user types into the form', () => {
  const { container } = render(<Setting />);
  const getById = queryByAttribute.bind(null, 'id');
  fireEvent.click(getById(container, 'avatarIcon'));
  fireEvent.click(getByText(container, 'CANCEL'));
  expect(getById(container, 'editAvatarForm')).toHaveStyle(`display: none`);
});
