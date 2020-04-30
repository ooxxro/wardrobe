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
    const categories = {
      hats: [],
      shirts: [],
      pants: [],
      shoes: [],
    };
    const { container } = render(
      <DesignComponent from="design" categories={categories} tags={[]} />
    );
    expect(container.innerHTML).toMatch('Design');
  });

  it('renders DesignComponent from="edit" without crashing', () => {
    const categories = {
      hats: [],
      shirts: [],
      pants: [],
      shoes: [],
    };
    const { getByText } = render(
      <DesignComponent
        from="edit"
        categories={categories}
        tags={[]}
        editOutfit={{}}
        editSelectedClothes={[]}
      />
    );
    expect(getByText(/done/i)).toBeInTheDocument();
  });
});
