import React from 'react';
import { render } from 'test-utils';
import ClothesFitter from './ClothesFitter';

it('renders ClothesFitter without crashing', () => {
  render(
    <ClothesFitter
      clothesSrc=""
      lockAspectRatio
      state={{
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      }}
    />
  );
});
