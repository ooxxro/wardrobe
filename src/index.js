import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import * as firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAxa02LRNqxRPpCJlh1u7A3isRsZFJI9hY',
  authDomain: 'wardrobe-rocks.firebaseapp.com',
  databaseURL: 'https://wardrobe-rocks.firebaseio.com',
  projectId: 'wardrobe-rocks',
  storageBucket: 'wardrobe-rocks.appspot.com',
  messagingSenderId: '1049503584150',
  appId: '1:1049503584150:web:edffde560062853bbf17b7',
  measurementId: 'G-KWLEGFFQL0',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const Root = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
