import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Setting from './components/Setting';

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" exact component={Login} />
        <Route path="/signup" exact component={SignUp} />
        <Route path="/setting" exact component={Setting} />
      </Switch>
    </Layout>
  );
}

export default App;
