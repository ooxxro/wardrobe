// https://testing-library.com/docs/react-testing-library/setup

// test-utils.js
import React from 'react';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { ThemeProvider } from '@material-ui/core/styles';
import { MuiTheme } from './theme';

const AllTheProviders = ({ children }) => {
  const history = createMemoryHistory();
  return (
    <Router history={history}>
      <ThemeProvider theme={MuiTheme}>{children}</ThemeProvider>
    </Router>
  );
};

const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options });

export function renderWithRouter(
  ui,
  { route = '/', history = createMemoryHistory({ initialEntries: [route] }) } = {}
) {
  const Wrapper = ({ children }) => <Router history={history}>{children}</Router>;
  return {
    ...render(ui, { wrapper: Wrapper }),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history,
  };
}

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
