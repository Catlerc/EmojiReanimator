import { fabric } from "./Vendor.js";
export var ImageType;
(function (ImageType) {
    ImageType[ImageType["gif"] = 0] = "gif";
    ImageType[ImageType["png"] = 1] = "png";
    ImageType[ImageType["jpeg"] = 2] = "jpeg";
    ImageType[ImageType["jpg"] = 3] = "jpg";
})(ImageType || (ImageType = {}));
export var StaticImageType;
(function (StaticImageType) {
    StaticImageType[StaticImageType["png"] = 0] = "png";
    StaticImageType[StaticImageType["jpeg"] = 1] = "jpeg";
    StaticImageType[StaticImageType["jpg"] = 2] = "jpg";
})(StaticImageType || (StaticImageType = {}));
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
    return Utils;
}());
export { Utils };
//# sourceMappingURL=Domain.js.map