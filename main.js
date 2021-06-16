var canvas = new fabric.Canvas('c')

fabric.Object.prototype.transparentCorners = false;
canvas.setBackgroundColor('rgb(254,254,254)', null);

var input = document.getElementById('file-input')
input.addEventListener('change', function (event) {
    const fileList = event.target.files;
    var file = fileList.item(0);

    canvas.clear();

    var reader = new FileReader();
    reader.onloadend = function() {
        fabric.Image.fromURL(reader.result, function (img) {
            var img2 = img.set({left: 175, top: 175});
            canvas.add(img2);

            canvas.renderAll();

            var gif = new GIF({
                workers: 2,
                quality: 10,
                //transparent: 0xFEFEFE
            });

            gif.addFrame(document.getElementById('c'));

            gif.on('finished', function (blob) {
                document.getElementById('mg').src = URL.createObjectURL(blob);
            });

            gif.render();
        })
    }
    reader.readAsDataURL(file);

});


