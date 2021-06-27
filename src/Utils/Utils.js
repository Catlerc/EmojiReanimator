import { fabric } from "../Vendor.js";
var Utils = (function () {
    function Utils() {
    }
    Utils.arrayBufferToUrl = function (imageBuffer, type) {
        var blob = new Blob([imageBuffer], { type: "image/" + type.toString() });
        var urlCreator = window.URL || window.webkitURL;
        return urlCreator.createObjectURL(blob);
    };
    Utils.createCanvas = function (width, height) {
        var renderer = document.createElement('canvas');
        renderer.width = width;
        renderer.height = height;
        return new fabric.Canvas(renderer);
    };
    Utils.imageDataToDataUrl = function (imageData) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = imageData.width;
        canvas.height = imageData.height;
        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL();
    };
    Utils.imageBlobToDataUrl = function (imageBlob) {
        var urlCreator = window.URL || window.webkitURL;
        return urlCreator.createObjectURL(imageBlob);
    };
    return Utils;
}());
export { Utils };
//# sourceMappingURL=Utils.js.map