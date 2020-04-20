const firebasemock = require('firebase-mock');
const MockStorageReference = require('./firebase-storage-reference');

// fix some missing features in storage, copied from
// https://github.com/dmurvihill/firebase-mock/blob/4a6a54d1651d51943aa82bc4d419114a6344e5a5/src/storage.js
firebasemock.MockStorage.prototype.ref = function(path) {
  path = path.replace(/\/+/g, '/');
  path = path.replace(/^\//g, '');
  path = path.replace(/\/$/g, '');
  let paths = path.split('/');
  let rootPath = paths.shift();
  if (!this.refs[rootPath]) {
    this.refs[rootPath] = new MockStorageReference(this, null, rootPath);
  }
  if (paths.length === 0) {
    return this.refs[rootPath];
  } else {
    return this.refs[rootPath].child(paths.join('/'));
  }
};

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

/**
 * mock functions()
 */
const cloudFunction = jest.fn(() => Promise.resolve({}));
const httpsCallable = jest.fn(() => cloudFunction);
const functions = {
  httpsCallable,
};
mocksdk.functions = jest.fn(() => functions);

export default mocksdk;
