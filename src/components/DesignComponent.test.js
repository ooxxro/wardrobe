import React from 'react';
import { render } from 'test-utils';
import DesignComponent from './DesignComponent';
import userStore from '../stores/UserStore';

describe('<DesignComponent>', () => {
  // fake login
  userStore.setUser({
    uid: 'testUid',
    email: 'mocktest@wardrobe.rocks',
    displayName: 'Mock Test',
    photoURL: null,
  });

  it('renders DesignComponent from="design" without crashing', () => {
    const { container } = render(<DesignComponent from="design" />);
    expect(container.innerHTML).toMatch('Design');
  });

  it('renders DesignComponent from="random" without crashing', () => {
    const { container } = render(<DesignComponent from="random" />);
    expect(container.innerHTML).toMatch('Random');
  });

  it('renders DesignComponent from="edit" without crashing', () => {
    const { getByText } = render(<DesignComponent from="edit" />);
    expect(getByText(/done/i)).toBeInTheDocument();
  });
});
