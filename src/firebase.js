import * as firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import userStore from './stores/UserStore';

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

// sync auth state with userStore
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // User is signed in.
    userStore.setUser(user);
  } else {
    userStore.setUser(null);
  }
});

export default firebase;
