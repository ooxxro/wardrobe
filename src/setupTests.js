// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import 'jest-canvas-mock';
import 'fake-indexeddb/auto'; // mock IDB

// mock firebase
jest.mock('./firebase.js');

// mock URL
global.URL.createObjectURL = jest.fn();

// mock call Image.onload when Image.src is set
// https://github.com/jsdom/jsdom/issues/1816#issuecomment-432496573
Object.defineProperty(global.Image.prototype, 'src', {
  set() {
    this.width = 100;
    this.height = 100;
    setTimeout(() => this.onload());
  },
});
