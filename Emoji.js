function createCanvas(width, height) {
  const renderer = document.createElement('canvas');
  renderer.width = width;
  renderer.height = height;
  return new fabric.Canvas(renderer);
}

async function createEmoji(options, imageURL, func) {// func: (canvas, image, t) => Promise[unit] t:[0,1] |  options: {width, height, fps, length (in seconds)}
  const canvas = createCanvas(options.width, options.height)
  const gif = new GIF({
    workers: 2,
    quality: 1,
    background: 0xFEFEFE,
    transparent: 0xFEFEFE,
    width: options.width,
    height: options.height
  });
  const totalFrames = Math.floor(options.length * options.fps);
  const delay = 1000 / options.fps;
  const fabricImage = await createImage(imageURL);
  const relativeImage = new RelativeImage(fabricImage);
  relativeImage.attach(canvas);
  relativeImage.rescaleToFit(canvas.width, canvas.height);
  relativeImage.setPos(0.5, 0.5);

  for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
    canvas.clear();
    canvas.setBackgroundColor('#FEFEFE', null);
    relativeImage.attach(canvas);
    await func(canvas, relativeImage, frameIndex / totalFrames);
    canvas.renderAll();
    gif.addFrame(canvas.contextContainer.getImageData(0, 0, options.width, options.height), {delay: delay});
  }

  return new Promise(
    resolve => {
      gif.on('finished', resolve);
      gif.render();
    });
}

