import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import firebase from './firebase';
import userStore from './stores/UserStore';

let rendered = false;

const Root = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// sync auth state with userStore
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // User is signed in.
    userStore.setUser(user);
  } else {
    userStore.setUser(null);
  }

  if (!rendered) {
    rendered = true;
    // render for the first time when auth state is known
    ReactDOM.render(<Root />, document.getElementById('root'));
  }
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
