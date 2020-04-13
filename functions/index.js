const functions = require('firebase-functions');
const removeBackgroundFromImageFile = require('remove.bg');

exports.removeBackground = functions.https.onCall((data, context) => {
  console.log('********************************');

  // the base64 encoded img
  let base64img = removeBackgroundFromImageFile({
    path: tmpFilePath,
    apiKey: 'wsVQCexgWUVd5BoWJYLgNh1X',
    size: 'regular',
    type: 'auto',
    scale: '50%',
    outputFile,
  })
    // eslint-disable-next-line promise/always-return
    .then(result => {
      console.log(`File saved to ${outputFile}`);
      base64img = result.base64img;
    })
    .catch(errors => {
      console.log(JSON.stringify(errors));
    });

  return base64img;
});
