import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import Layout from './components/Layout';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Setting from './components/Setting';
import { StoreProvider } from './stores/stores';

const myTheme = createMuiTheme({
  palette: {
    primary: {
      main: theme.primary,
    },
    // secondary: '',
    // error: '',
    // warning: '',
    // info: '',
    // success: '',
  },
});

function App() {
  return (
    <StoreProvider>
      <ThemeProvider theme={myTheme}>
        <Layout>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/login" exact component={Login} />
            <Route path="/signup" exact component={SignUp} />
            <Route path="/setting" exact component={Setting} />
          </Switch>
        </Layout>
      </ThemeProvider>
    </StoreProvider>
  );
}

export default App;
