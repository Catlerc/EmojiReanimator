
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
      async (canvas, relativeImage, t) => {

        relativeImage.setPos(t + relativeImage.width / 2, 0.5);
        const clone = await relativeImage.copy()
        clone.setPos((t - 1) + relativeImage.width / 2, 0.5);

      }
    ).then(emoji =>
      document.getElementById('output').src = URL.createObjectURL(emoji)
    )


  }
  reader.readAsDataURL(file);

});


