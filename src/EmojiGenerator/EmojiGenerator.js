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
import { AnimatedImage, FrameType, ImageUpdateFrame, Pixels } from "../Image/AnimatedImage.js";
import { RelativeImage } from "../Image/RelativeImage/RelativeImage.js";
import { Utils } from "../Utils/Utils.js";
var EmojiGenerator = (function () {
    function EmojiGenerator(namePrefix, frameGenerator, rotation, preprocess) {
        if (rotation === void 0) { rotation = 0; }
        if (preprocess === void 0) { preprocess = []; }
        this.namePrefix = namePrefix;
        this.frameGenerator = frameGenerator;
        this.rotation = rotation;
        this.preprocess = preprocess;
    }
    EmojiGenerator.prepareCanvas = function (canvas) {
        canvas.clear();
        canvas.setBackgroundColor("#FFFFFF", null);
    };
    EmojiGenerator.prototype.generate = function (image, options, cancelCheck) {
        return __awaiter(this, void 0, void 0, function () {
            var timeline, relativeImage, currentImage, lastFrameTime, _loop_1, this_1, _i, _a, frame, state_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        timeline = [];
                        relativeImage = new RelativeImage(image);
                        relativeImage.rescaleToFit(options.width, options.height);
                        _loop_1 = function (frame) {
                            var index, canvas_1, timeNormalized, imageUpdateFrame, pixelsRaw_1, pixels, relativeFabricImages, imageData, imageForRotation;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        if (cancelCheck())
                                            return [2, "break"];
                                        index = image.timeline.indexOf(frame);
                                        if (!(frame.type !== FrameType.End)) return [3, 5];
                                        canvas_1 = Utils.createCanvas(options.width, options.height);
                                        relativeImage.attach(canvas_1);
                                        timeNormalized = index / (image.timeline.length - 1);
                                        if (!(frame.type == FrameType.ImageUpdate)) return [3, 2];
                                        imageUpdateFrame = frame;
                                        pixelsRaw_1 = imageUpdateFrame.image;
                                        this_1.preprocess.forEach(function (preprocess) {
                                            pixelsRaw_1 = preprocess(pixelsRaw_1);
                                        });
                                        pixels = pixelsRaw_1;
                                        return [4, relativeImage.getFabricImageForFrame(pixels.toImageData())];
                                    case 1:
                                        currentImage = _c.sent();
                                        _c.label = 2;
                                    case 2:
                                        EmojiGenerator.prepareCanvas(canvas_1);
                                        return [4, this_1.frameGenerator(currentImage, timeNormalized)];
                                    case 3:
                                        relativeFabricImages = _c.sent();
                                        relativeFabricImages.forEach(function (img) { return canvas_1.add(img.underlying); });
                                        canvas_1.renderAll();
                                        imageData = canvas_1.contextContainer.getImageData(0, 0, options.width, options.height);
                                        EmojiGenerator.prepareCanvas(canvas_1);
                                        return [4, Utils.fabricImageFromDataUrl(Utils.imageDataToDataUrl(imageData))];
                                    case 4:
                                        imageForRotation = _c.sent();
                                        imageForRotation.set({
                                            originX: "center",
                                            originY: "center",
                                            angle: this_1.rotation,
                                            left: canvas_1.width / 2,
                                            top: canvas_1.height / 2
                                        });
                                        canvas_1.add(imageForRotation);
                                        canvas_1.renderAll();
                                        timeline.push(new ImageUpdateFrame(Pixels.fromImageData(canvas_1.contextContainer.getImageData(0, 0, options.width, options.height)), frame.time));
                                        lastFrameTime = frame.time;
                                        return [3, 6];
                                    case 5:
                                        timeline.push(frame);
                                        _c.label = 6;
                                    case 6: return [2];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, _a = image.timeline;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3, 4];
                        frame = _a[_i];
                        return [5, _loop_1(frame)];
                    case 2:
                        state_1 = _b.sent();
                        if (state_1 === "break")
                            return [3, 4];
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3, 1];
                    case 4: return [2, new AnimatedImage(options.width, options.height, timeline)];
                }
            });
        });
    };
    return EmojiGenerator;
}());
export { EmojiGenerator };
//# sourceMappingURL=EmojiGenerator.js.map