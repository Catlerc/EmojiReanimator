var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { GifFile } from "../Vendor.js";
import { Left, Right } from "../Utils/Either.js";
import { ImageType, StaticImageType } from "../Domain.js";
import { Utils } from "../Utils/Utils.js";
export var FrameType;
(function (FrameType) {
    FrameType[FrameType["ImageUpdate"] = 0] = "ImageUpdate";
    FrameType[FrameType["Update"] = 1] = "Update";
    FrameType[FrameType["End"] = 2] = "End";
})(FrameType || (FrameType = {}));
var Pixels = (function () {
    function Pixels(data) {
        this.data = data;
    }
    Pixels.fromImageData = function (imageData) {
        var data = imageData.data;
        var pixelsData = [];
        for (var y = 0; y < imageData.height; y++) {
            var line = [];
            for (var x = 0; x < imageData.width; x++) {
                var pixelOffset = (y * imageData.width + x) * 4;
                var color = [data[pixelOffset], data[pixelOffset + 1], data[pixelOffset + 2], data[pixelOffset + 3]];
                line.push(color);
            }
            pixelsData.push(line);
        }
        return new Pixels(pixelsData);
    };
    Pixels.prototype.toImageData = function () {
        var height = this.data.length;
        var width = this.data[0].length;
        var data = [];
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                var color = this.data[y][x];
                data.push(color[0]);
                data.push(color[1]);
                data.push(color[2]);
                data.push(color[3]);
            }
        }
        return new ImageData(new Uint8ClampedArray(data), width, height);
    };
    return Pixels;
}());
export { Pixels };
var UpdateFrame = (function () {
    function UpdateFrame(time) {
        this.type = FrameType.Update;
        this.time = time;
    }
    return UpdateFrame;
}());
export { UpdateFrame };
var ImageUpdateFrame = (function () {
    function ImageUpdateFrame(image, time) {
        this.type = FrameType.ImageUpdate;
        this.time = time;
        this.image = image;
    }
    return ImageUpdateFrame;
}());
export { ImageUpdateFrame };
var EndFrame = (function () {
    function EndFrame(time) {
        this.type = FrameType.End;
        this.time = time;
    }
    return EndFrame;
}());
export { EndFrame };
var AnimatedImage = (function () {
    function AnimatedImage(width, height, timeline) {
        this.type = ImageType.gif;
        this.timeline = timeline;
        this.width = width;
        this.height = height;
    }
    AnimatedImage.prototype.expandTimeline = function (length, fps) {
        var lastFrame = this.timeline[this.timeline.length - 1];
        if (length <= lastFrame.time)
            return this;
        var newTimeline = this.timeline.slice();
        newTimeline.pop();
        var step = 1 / fps;
        var timer = 0;
        for (var i = 0; i < Math.floor(length * fps) - 1; i++) {
            timer += step;
            newTimeline.push(new UpdateFrame(timer));
        }
        var res = new AnimatedImage(this.width, this.height, newTimeline.sort(function (a, b) {
            if (a.time < b.time)
                return -1;
            if (a.time > b.time)
                return 1;
            return 0;
        }));
        newTimeline.push(new EndFrame(Math.max(newTimeline[newTimeline.length - 1].time, length)));
        return res;
    };
    AnimatedImage.fromGIF = function (gifBuffer) {
        var rgbRegex = /rgb\((\d+),(\d+),(\d+)\)/;
        var gifFile = new GifFile(gifBuffer);
        var newTimeline = [];
        var timer = 0;
        gifFile.frames.forEach(function (frame) {
            var frameImageData = [];
            var regexResults = frame.pixelColors.map(function (pixelColor) { return pixelColor.match(rgbRegex); });
            regexResults.forEach(function (pixelRegexResult) {
                if (pixelRegexResult !== null) {
                    for (var i = 1; i <= 3; i++)
                        frameImageData.push(Number(pixelRegexResult[i]));
                    frameImageData.push(255);
                }
                else
                    for (var i = 0; i < 4; i++)
                        frameImageData.push(0);
            });
            var imageData = new ImageData(new Uint8ClampedArray(frameImageData), gifFile.canvasWidth, gifFile.canvasHeight);
            newTimeline.push(new ImageUpdateFrame(Pixels.fromImageData(imageData), timer));
            timer += frame.delayTime;
        });
        newTimeline.push(new EndFrame(timer));
        return new AnimatedImage(gifFile.canvasWidth, gifFile.canvasHeight, newTimeline);
    };
    AnimatedImage.fromImage = function (imageBuffer, extension) {
        var _this = this;
        return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(extension == "gif")) return [3, 1];
                        resolve(new Right(AnimatedImage.fromGIF(imageBuffer)));
                        return [3, 4];
                    case 1:
                        if (!(extension in StaticImageType)) return [3, 3];
                        _a = resolve;
                        _b = Right.bind;
                        return [4, AnimatedImage.fromStaticImage(imageBuffer, extension)];
                    case 2:
                        _a.apply(void 0, [new (_b.apply(Right, [void 0, _c.sent()]))()]);
                        return [3, 4];
                    case 3:
                        resolve(new Left(new Error("unsupported file extension '" + extension + "'")));
                        _c.label = 4;
                    case 4: return [2];
                }
            });
        }); });
    };
    AnimatedImage.fromStaticImage = function (imageBuffer, type) {
        var imageUrl = Utils.arrayBufferToUrl(imageBuffer, type.toString());
        var image = new Image();
        image.src = imageUrl;
        return new Promise(function (resolve) {
            image.onload = function () {
                var canvas = document.createElement("canvas");
                canvas.width = image.width;
                canvas.height = image.height;
                var canvasContext = canvas.getContext("2d");
                canvasContext.drawImage(image, 0, 0);
                var imageData = canvasContext.getImageData(0, 0, image.width, image.height);
                resolve(new AnimatedImage(image.width, image.height, [
                    new ImageUpdateFrame(Pixels.fromImageData(imageData), 0),
                    new EndFrame(0)
                ]));
            };
        });
    };
    return AnimatedImage;
}());
export { AnimatedImage };
//# sourceMappingURL=AnimatedImage.js.map