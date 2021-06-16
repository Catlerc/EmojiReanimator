var canvas = new fabric.Canvas('c')

fabric.Object.prototype.transparentCorners = false;

var can =document.getElementById('c')
var input = document.getElementById('file-input')
input.addEventListener('change', function (event) {
    const fileList = event.target.files;
    var file = fileList.item(0);



    var reader = new FileReader();
    reader.onloadend = function() {
        fabric.Image.fromURL(reader.result, function (img) {
            canvas.clear();
            canvas.setBackgroundColor('rgb(254,254,254)', null);
            canvas.add(img.set({left: 175, top: 175}));
            canvas.renderAll();

            var gif = new GIF({
                workers: 2,
                quality: 10,
                transparent: 0xFEFEFE
            });
            var frame1 = document.createElement('img');
            frame1.width=300;
            frame1.height=300;
            frame1.src = can.toDataURL();
            gif.addFrame(frame1, {delay: 300});



            ////

            canvas.clear();
            canvas.setBackgroundColor('rgb(254,254,254)', null);
            canvas.add(img.set({left: 75, top: 175}));
            canvas.renderAll();
            var frame2 = document.createElement('img');
            frame2.src = can.toDataURL();
            frame2.width=300;
            frame2.height=300;
            gif.addFrame(frame2, {delay: 300});
            //

            gif.on('finished', function (blob) {
                document.getElementById('mg').src = URL.createObjectURL(blob);
            });

            gif.render();
        })
    }
    reader.readAsDataURL(file);

});


