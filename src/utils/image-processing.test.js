// import {} from 'test-utils';
import { resizeImg, dataURL2file } from './image-processing';

describe('dataURL2file', () => {
  it('turns dataURL to file without error', () => {
    const file = dataURL2file(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2PoM1r0HwAFFgJiBgfF6QAAAABJRU5ErkJggg=='
    );
    expect(file).toBeInstanceOf(File);
  });
});

describe('resizeImg', () => {
  it('should return file without error', async () => {
    const inputFile = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });

    // mock image onload with width/height 100
    Object.defineProperty(global.Image.prototype, 'src', {
      set() {
        this.width = 100;
        this.height = 100;
        setTimeout(() => this.onload());
      },
    });

    const { file, aspectRatio } = await resizeImg(inputFile, 'image.png', 100, 100);
    expect(file).toBeInstanceOf(File);
    expect(aspectRatio).toBe(1);
  });
});
