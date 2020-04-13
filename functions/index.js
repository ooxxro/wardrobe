const functions = require('firebase-functions');
const { removeBackgroundFromImageBase64 } = require('remove.bg');

exports.removeBackground = functions.https.onCall((data, context) => {
  return removeBackgroundFromImageBase64({
    base64img: data.base64,
    apiKey: 'wsVQCexgWUVd5BoWJYLgNh1X',
    size: 'regular',
    type: 'auto',
    outputFile: '/tmp/tmp.png',
  })
    .then(result => {
      return result.base64img;
    })
    .catch(errors => {
      console.log(JSON.stringify(errors));
    });
});
