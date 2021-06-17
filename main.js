var canvas = createCanvas(256, 256)

fabric.Object.prototype.transparentCorners = false;

function createImage(imageUrl) {
  return new Promise(resolve => fabric.Image.fromURL(imageUrl, resolve))
}

var input = document.getElementById('file-input')
input.addEventListener('change', function (event) {
  const fileList = event.target.files;
  var file = fileList.item(0);
  var reader = new FileReader();
  reader.onloadend = function () {


    createEmoji(
      {
        width: 128,
        height: 128,
        fps: 20,
        length: 1
      },
      reader.result,
      (canvas, imageURL, t) =>
        createImage(imageURL)
          .then((image) => canvas.add(image.set({left: canvas.width * t, top: 0})))
          .then(() => createImage(imageURL))
          .then((image) => canvas.add(image.set({left: canvas.width * (t - 1), top: 0})))
    ).then(emoji =>
      document.getElementById('output').src = URL.createObjectURL(emoji)
    )


  }
  reader.readAsDataURL(file);

});


