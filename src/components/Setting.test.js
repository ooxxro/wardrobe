import React from 'react';
import { render, fireEvent } from 'test-utils';
import Setting from './Setting';
import userStore from '../stores/UserStore';
import firebase from '../firebase';

describe('<Setting>', () => {
  // mock userStore login
  userStore.setUser({
    uid: 'testUid',
    email: 'mocktest@wardrobe.rocks',
    displayName: 'Mock Test',
    photoURL: null,
  });

  it('renders Setting without crashing', () => {
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
});
