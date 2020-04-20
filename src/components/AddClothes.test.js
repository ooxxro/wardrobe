import React from 'react';
import { render, fireEvent, waitForElement } from 'test-utils';
import AddClothes from './AddClothes';
import firebase from '../firebase';
import userStore from '../stores/UserStore';

describe('<AddClothes>', () => {
  // fake login
  userStore.setUser({
    uid: 'testUid',
    email: 'mocktest@wardrobe.rocks',
    displayName: 'Mock Test',
    photoURL: null,
  });

  it('renders AddClothes without crashing', () => {
    const { container } = render(<AddClothes />);
    expect(container.innerHTML).toMatch('Add clothes');
  });

  it('AddClothes upload image and click through steps', async () => {
    const { getByText, getByTestId, getByAltText, queryByText } = render(<AddClothes />);

    // step1
    expect(getByText(/Add clothes/i)).toBeInTheDocument();
    expect(queryByText(/^back$/i)).toBeNull();
    expect(queryByText(/^next$/i)).toBeNull();

    // upload file
    const upload = getByTestId('uploadImg');
    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
    fireEvent.change(upload, { target: { files: [file] } });

    const nextBtn = await waitForElement(() => getByText(/^next$/i));

    // step2
    expect(getByText(/^back$/i)).toBeInTheDocument();
    const removeBgBtn = getByText(/^remove background$/i);
    expect(removeBgBtn).toBeInTheDocument();

    // click remove background
    const removeBackground = jest.fn(() =>
      Promise.resolve({
        data:
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      })
    );
    const httpsCallable = jest.fn(() => removeBackground);
    firebase.functions().httpsCallable = httpsCallable;

    fireEvent.click(removeBgBtn);

    await waitForElement(() => getByText(/^cancel$/i)); // wait for async
    expect(httpsCallable).toHaveBeenCalledWith('removeBackground');
    expect(removeBackground).toHaveBeenCalledTimes(1);
    expect(getByAltText(/image with background removed/i)).toBeInTheDocument();

    fireEvent.click(nextBtn);

    // step3
    expect(getByText(/Drag and resize clothes to fit mannequin/i)).toBeInTheDocument();

    fireEvent.click(nextBtn);

    // step4
    const finishBtn = getByText(/finish/i);

    expect(getByText(/Select category for your clothes:/i)).toBeInTheDocument();
    expect(getByText(/Add custom tags:/i)).toBeInTheDocument();
    expect(finishBtn).toBeInTheDocument();

    fireEvent.click(finishBtn);

    // finish dialog
    await waitForElement(() => getByText(/Continue Adding Clothes/i));
  });
});
