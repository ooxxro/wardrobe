const firebasemock = require('firebase-mock');

const mockauth = new firebasemock.MockAuthentication();
// const mockdatabase = new firebasemock.MockFirebase();
const mockfirestore = new firebasemock.MockFirestore();
const mockstorage = new firebasemock.MockStorage();
// const mockmessaging = new firebasemock.MockMessaging();
const mocksdk = new firebasemock.MockFirebaseSdk(
  // use null if your code does not use RTDB
  null,
  // use null if your code does not use AUTHENTICATION
  () => {
    return mockauth;
  },
  // use null if your code does not use FIRESTORE
  () => {
    return mockfirestore;
  },
  // use null if your code does not use STORAGE
  () => {
    return mockstorage;
  },
  // use null if your code does not use MESSAGING
  null
  // () => {
  //   return mockmessaging;
  // }
);

// const firebase = {
//   auth: () => ({
//     onAuthStateChanged: jest.fn(),
//     currentUser: {
//       displayName: 'testDisplayName',
//       email: 'test@test.com',
//       emailVerified: true,
//     },
//     sendPasswordResetEmail: jest.fn(() => Promise.resolve()),
//     createUserWithEmailAndPassword: jest.fn(() =>
//       Promise.resolve('result of createUserWithEmailAndPassword')
//     ),
//     signInWithEmailAndPassword: jest.fn(() =>
//       Promise.resolve('result of signInWithEmailAndPassword')
//     ),
//   }),
// };

export default mocksdk;
