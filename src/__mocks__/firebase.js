const firebase = {
  auth: () => ({
    onAuthStateChanged: jest.fn(),
    currentUser: {
      displayName: 'testDisplayName',
      email: 'test@test.com',
      emailVerified: true,
    },
    sendPasswordResetEmail: jest.fn(() => Promise.resolve()),
    createUserWithEmailAndPassword: jest.fn(() =>
      Promise.resolve('result of createUserWithEmailAndPassword')
    ),
    signInWithEmailAndPassword: jest.fn(() =>
      Promise.resolve('result of signInWithEmailAndPassword')
    ),
  }),
};

export default firebase;
