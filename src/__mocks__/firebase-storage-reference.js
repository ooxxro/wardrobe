// currently (firebase-mock@2.3.2)
// doesn't have .on('state_changed') callback implemented
// and doesn't have task.ref.getDownloadURL too...

// below is copy of https://github.com/dmurvihill/firebase-mock/blob/4a6a54d1651d51943aa82bc4d419114a6344e5a5/src/storage-reference.js#L9
/*
  Mock for firebase.storage.Reference
  https://firebase.google.com/docs/reference/js/firebase.storage.Reference
*/

'use strict';

function MockStorageReference(storage, parent, name) {
  this.bucket = parent ? parent.bucket : name;
  this.storage = storage;
  this.parent = parent;
  this.name = name;
  this.root = parent ? parent.root : this;
  this._children = {};
  this._contents = null;

  if (parent) {
    this.fullPath = parent.fullPath + '/' + name;
    parent._children[name] = this;
  } else {
    this.fullPath = name;
  }

  this.Task = {
    then: () => Promise.resolve(),
    on: (type, progressCb, errCb, doneCb) => {
      setTimeout(() => {
        progressCb({
          state: 'running',
          bytesTransferred: 1,
          totalBytes: 2,
        });

        setTimeout(() => doneCb(), 0);
      }, 0);
    },
    snapshot: {
      ref: {
        getDownloadURL: () => Promise.resolve(this.fullPath),
      },
    },
  };
}

MockStorageReference.prototype.child = function(path) {
  // replace multiple consecutive slashs with single slash
  path = path.replace(/\/+/g, '/');

  // replace leading slash
  path = path.replace(/^\//g, '');

  // replace trailing slash
  path = path.replace(/\/$/g, '');

  // get all paths
  let paths = path.split('/');

  // create child reference
  let childPath = paths.shift();
  if (!this._children[childPath]) {
    this._children[childPath] = new MockStorageReference(this.storage, this, childPath);
  }

  if (paths.length === 0) {
    return this._children[childPath];
  } else {
    return this._children[childPath].child(paths.join('/'));
  }
};

MockStorageReference.prototype.getDownloadURL = function() {
  return Promise.resolve(this.fullPath);
};

MockStorageReference.prototype.delete = function() {
  this._contents = null;
  return Promise.resolve();
};

MockStorageReference.prototype.put = function(data) {
  this._contents = data;
  // return Promise.resolve();
  return this.Task;
};

MockStorageReference.prototype.putString = function(data) {
  this._contents = data;
  return Promise.resolve();
};

module.exports = MockStorageReference;
