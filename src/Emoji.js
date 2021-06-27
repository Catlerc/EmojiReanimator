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
import { GifEncoder } from "./Vendor.js";
import { RelativeImage } from "./RelativeImage.js";
import { FrameType } from "./AnimatedImage.js";
import { Option } from "./Utils/Option.js";
import { Utils } from "./Utils/Utils.js";
var Emoji = (function () {
    function Emoji(namePostfix, renderer) {
        this.renderedGif = Option.none();
        this.imageElement = Option.none();
        this.namePostfix = namePostfix;
        this.renderer = renderer;
    }
    Emoji.prototype.attach = function (imageElement) {
        this.imageElement = Option.some(imageElement);
    };
    Emoji.prototype.updateAttachedImageElement = function () {
        var _this = this;
        this.imageElement.flatMap(function (imageElement) { return _this.renderedGif.map(function (gif) { return imageElement.src = Utils.imageBlobToDataUrl(gif); }); });
    };
    Emoji.prototype.render = function (options, imageRaw) {
        return __awaiter(this, void 0, void 0, function () {
            var image, canvas, gifEncoder, relativeImage, oldImage, frameIndex, frame, nextFrame, delay, timeNormalized;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        image = imageRaw;
                        options.expandTimeline.map(function (expandTimelineOptions) {
                            return image = image.expandTimeline(expandTimelineOptions.length, expandTimelineOptions.fps);
                        });
                        canvas = Utils.createCanvas(options.width, options.height);
                        gifEncoder = new GifEncoder({
                            workers: 2,
                            quality: 100,
                            background: 0xFFFFFF,
                            width: options.width,
                            height: options.height,
                            workerScript: "./vendor/gif.worker.js"
                        });
                        relativeImage = new RelativeImage(image);
                        relativeImage.attach(canvas);
                        relativeImage.rescaleToFit(options.width, options.height);
                        frameIndex = 0;
                        _a.label = 1;
                    case 1:
                        if (!(frameIndex < image.timeline.length - 1)) return [3, 6];
                        frame = image.timeline[frameIndex];
                        nextFrame = image.timeline[frameIndex + 1];
                        delay = (nextFrame.time - frame.time) * 1000;
                        timeNormalized = frameIndex / (image.timeline.length - 1);
                        if (!(frame.type == FrameType.ImageUpdate)) return [3, 3];
                        return [4, relativeImage.getFabricImageForFrame(frame)];
                    case 2:
                        oldImage = _a.sent();
                        _a.label = 3;
                    case 3:
                        canvas.clear();
                        canvas.setBackgroundColor('#FFFFFF', null);
                        return [4, this.renderer(canvas, oldImage, timeNormalized)];
                    case 4:
                        _a.sent();
                        canvas.renderAll();
                        gifEncoder.addFrame(canvas.contextContainer.getImageData(0, 0, options.width, options.height), { delay: delay });
                        _a.label = 5;
                    case 5:
                        frameIndex++;
                        return [3, 1];
                    case 6: return [2, new Promise(function (resolve) {
                            gifEncoder.on('finished', function (gif) {
                                _this.renderedGif = Option.some(gif);
                                _this.updateAttachedImageElement();
                                resolve(gif);
                            });
                            gifEncoder.render();
                        })];
                }
            });
        });
    };
    return Emoji;
}());
export { Emoji };
//# sourceMappingURL=Emoji.js.map