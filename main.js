function createCanvas(width, height) {
  const renderer = document.createElement('canvas');
  renderer.width = width;
  renderer.height = height;
  return new fabric.Canvas(renderer);
}

var canvas = createCanvas(256, 256)

fabric.Object.prototype.transparentCorners = false;

var input = document.getElementById('file-input')
input.addEventListener('change', function (event) {
  const fileList = event.target.files;
  var file = fileList.item(0);


  var reader = new FileReader();
  reader.onloadend = function () {
    fabric.Image.fromURL(reader.result, function (img) {
      canvas.clear();
      canvas.setBackgroundColor('rgb(254,254,254)', null);
      canvas.add(img.set({left: 175, top: 175}));
      canvas.renderAll();

      var gif = new GIF({
        workers: 2,
        quality: 10,
        transparent: 0xFEFEFE,
        width: 256,
        height: 256
      });
      gif.addFrame(canvas.contextContainer.getImageData(0, 0, 256, 256), {delay: 300});


      ////

      canvas.clear();
      canvas.setBackgroundColor('rgb(254,254,254)', null);
      canvas.add(img.set({left: 75, top: 175}));
      canvas.renderAll();
      gif.addFrame(canvas.contextContainer.getImageData(0, 0, 256, 256), {delay: 300});
      //

      gif.on('finished', function (blob) {
        document.getElementById('output').src = URL.createObjectURL(blob);
      });

      gif.render();
    })
  }
  reader.readAsDataURL(file);

});


