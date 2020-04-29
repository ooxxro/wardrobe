/**
 * Given a image url, load the image and return a Image object
 *
 * @param {string} url
 */
export function loadOneImg(url) {
  return new Promise((resolve, reject) => {
    // load original image
    let img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      resolve(img);
    };
    img.onerror = error => {
      reject(error);
    };
    img.src = url;
  });
}

/**
 * Given an Image object (for example load using loadOneImg(url) above), return it's dataURL
 * @param {Image} img
 */
export function img2dataURL(img) {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, img.width, img.height);
  // read from canvas to png image file
  const dataURL = canvas.toDataURL('image/png');
  return dataURL;
}

export function dataURL2file(dataURL, filename = 'image.png') {
  // https://stackoverflow.com/a/43358515/12017013
  let arr = dataURL.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export function resizeImg(file, filename = 'image.png', resizeWidth, resizeHeight) {
  return new Promise((resolve, reject) => {
    // load original image
    const original = new Image();
    original.onload = () => {
      const wCount = original.width / resizeWidth;
      const hCount = original.height / resizeHeight;
      if (wCount < 1 && hCount < 1) {
        // already smaller, no need to resize
        resolve({
          file,
          aspectRatio: original.width / original.height,
        });
        return;
      }

      // put image to canvas
      const canvas = document.createElement('canvas');
      if (wCount > hCount) {
        // original image is a "wide" one
        canvas.width = resizeWidth;
        canvas.height = (resizeWidth * original.height) / original.width;
      } else {
        // original image is a "tall" one
        canvas.height = resizeHeight;
        canvas.width = (resizeHeight * original.width) / original.height;
      }
      // resize image using canvas
      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        original,
        0,
        0,
        original.width,
        original.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
      // read from canvas to png image file
      let dataURL = canvas.toDataURL('image/png');

      resolve({
        file: dataURL2file(dataURL, filename),
        aspectRatio: original.width / original.height,
      });
    };
    original.onerror = error => {
      reject(error);
    };
    original.src = URL.createObjectURL(file);
  });
}

/**
 * Given a dataURL, download the image to user computer.
 *
 * @param {string} dataURL
 * @param {string} [filename='download.png'] - filename, optional defaults to 'download.png'
 */
export function downloadImg(dataURL, filename = 'download.png') {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
