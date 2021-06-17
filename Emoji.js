function createCanvas(width, height) {
  const renderer = document.createElement('canvas');
  renderer.width = width;
  renderer.height = height;
  return new fabric.Canvas(renderer);
}

function prom(func) {
  return new Promise(resolve => resolve(func));
}

function createEmoji(options, imageURL, func) {// func: (canvas, image, t) => Promise[unit] t:[0,1] |  options: {width, height, fps, length (in seconds)}
  const canvas = createCanvas(options.width, options.height)
  const gif = new GIF({
    workers: 2,
    quality: 10,
    transparent: 0xEEEEEE,
    width: options.width,
    height: options.height
  });
  const totalFrames = Math.floor(options.length * options.fps);
  const delay = 1000 / options.fps;
  var computations = new Promise(resolve => resolve())
  for (let frameIndex = 0; frameIndex <= totalFrames; frameIndex++) {
    computations = computations.then(() => {
      canvas.clear();
      canvas.setBackgroundColor('#EEEEEE', null);
    }).then(() =>
      func(canvas, imageURL, frameIndex / totalFrames)
    ).then(() => {
      canvas.renderAll();
      gif.addFrame(canvas.contextContainer.getImageData(0, 0, options.width, options.height), {delay: delay});
    })
  }


  return computations.then(() => new Promise(
    resolve => {
      gif.on('finished', resolve);
      gif.render();
    }));
}

