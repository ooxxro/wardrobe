const functions = require('firebase-functions');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!');
});

exports.removeBackground = functions.https.onCall((data, context) => {
  console.log('***************** removeBackgroud ***************');

  // the base64 encoded img
  const base64img = data.base64;

  // TODO: call remove.bg API, get the result file
  // const resultBase64img = result.base64img
  const resultBase64img = base64img;

  // return base64 encoded img
  return resultBase64img;
});
