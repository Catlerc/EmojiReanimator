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
import { Emoji } from "./Image/Emoji.js";
import { AnimatedImage } from "./Image/AnimatedImage.js";
import { Option } from "./Utils/Option.js";
import { Utils } from "./Utils/Utils.js";
import { EmojiSizeWarning } from "./EmojiSizeWarning.js";
import { EmojiGeneratorList } from "./EmojiGenerator/EmojiGeneratorList.js";
import { BlobFetcher } from "./BlobFetcher.js";
import { FileName } from "./FileName.js";
var Application = (function () {
    function Application(emojiNameInput, fileInput, smileSizeInput, compressionInput, forceAnimateInput, animationLengthInput, fpsInput, imagePreview, downloadButton, smoothRotationInput, animationReverseInput, flipHorizontalInput, flipVerticalInput, imageByUrlDiv) {
        this.emojiNameInput = emojiNameInput;
        this.fileInput = fileInput;
        this.smileSizeInput = smileSizeInput;
        this.compressionInput = compressionInput;
        this.forceAnimateInput = forceAnimateInput;
        this.animationLengthInput = animationLengthInput;
        this.fpsInput = fpsInput;
        this.imagePreview = imagePreview;
        this.downloadButton = downloadButton;
        this.smoothRotationInput = smoothRotationInput;
        this.animationReverseInput = animationReverseInput;
        this.flipHorizontalInput = flipHorizontalInput;
        this.flipVerticalInput = flipVerticalInput;
        this.imageByUrlDiv = imageByUrlDiv;
        this.emojis = [];
        this.options = {
            width: 64,
            height: 64,
            sourceImage: Option.none(),
            expandTimeline: Option.none(),
            SmoothRotation: true,
            animationReverse: false,
            flipHorizontal: false,
            flipVertical: false
        };
        this.reloadOptions();
        this.emojiSizeWarning = new EmojiSizeWarning();
        this.emojiSizeWarning.updateRoot(document.body);
    }
    Application.prototype.inputChange = function () {
        this.reloadOptions();
        this.redraw();
    };
    Application.prototype.initializeEvents = function () {
        var _this = this;
        this.emojiNameInput.onchange = function () { return _this.reloadOptions(); };
        this.smileSizeInput.onchange = function () { return _this.inputChange(); };
        this.compressionInput.onchange = function () { return _this.inputChange(); };
        this.animationReverseInput.onchange = function () { return _this.inputChange(); };
        this.flipHorizontalInput.onchange = function () { return _this.inputChange(); };
        this.flipVerticalInput.onchange = function () { return _this.inputChange(); };
        this.animationLengthInput.onchange = function () { return _this.inputChange(); };
        this.fpsInput.onchange = function () { return _this.inputChange(); };
        this.smoothRotationInput.onchange = function () { return _this.inputChange(); };
        this.forceAnimateInput.onchange = function () {
            if (_this.forceAnimateInput.checked) {
                _this.animationLengthInput.disabled = false;
                _this.fpsInput.disabled = false;
            }
            else {
                _this.animationLengthInput.disabled = true;
                _this.fpsInput.disabled = true;
            }
            _this.inputChange();
        };
        this.imageByUrlDiv.onclick = function () { return __awaiter(_this, void 0, void 0, function () {
            var url, maybeBlob, blobWithName;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, navigator.clipboard.readText()];
                    case 1:
                        url = _a.sent();
                        return [4, BlobFetcher.fetch(url)];
                    case 2:
                        maybeBlob = _a.sent();
                        blobWithName = maybeBlob.flatMap(function (blob) {
                            return FileName.fromBlobAndUrl(blob, url).map(function (filename) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2, this.useNewInputImage(blob, filename)];
                            }); }); });
                        });
                        if (blobWithName.isEmpty())
                            alert("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u043F\u043E \u0430\u0434\u0440\u0435\u0441\u0443 '" + url + "'");
                        return [2];
                }
            });
        }); };
        this.fileInput.onchange = function (event) {
            var fileList = event.target.files;
            var file = fileList.item(0);
            var reader = new FileReader();
            if (file) {
                reader.onloadend = function () { return __awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        return [2, FileName.fromBlobAndUrl(file, file.name)
                                .fold(function () { return alert("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0440\u0430\u0441\u043F\u0430\u0440\u0441\u0438\u0442\u044C \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 '" + file.name + "'"); }, function (filename) { return _this.useNewInputImage(file, filename); })];
                    });
                }); };
                setTimeout(function () { return reader.readAsArrayBuffer(file); }, 10);
            }
            _this.fileInput.value = "";
        };
        this.downloadButton.onclick = function () { return _this.downloadRenderedEmojis(); };
    };
    Application.prototype.syncGifs = function () {
        this.emojis.forEach(function (emoji) { return emoji.imageElement.forEach(function (imgElement) { return imgElement.src = imgElement.src; }); });
    };
    Application.prototype.reloadOptions = function () {
        var _this = this;
        var oldOptions = this.options;
        var size = Number(this.smileSizeInput.value);
        var expandTimelineOptions = Option.none();
        if (this.forceAnimateInput.checked)
            expandTimelineOptions = Option.some({
                length: Number(this.animationLengthInput.value),
                fps: Number(this.fpsInput.value)
            });
        var newEmojiName = this.emojiNameInput.value;
        this.options = {
            sourceImage: oldOptions.sourceImage.map(function (options) {
                options.name = newEmojiName;
                return options;
            }),
            width: size,
            height: size,
            expandTimeline: expandTimelineOptions,
            SmoothRotation: this.smoothRotationInput.checked,
            animationReverse: this.animationReverseInput.checked,
            flipHorizontal: this.flipHorizontalInput.checked,
            flipVertical: this.flipVerticalInput.checked
        };
        this.emojiGeneratorList = new EmojiGeneratorList(this.options.SmoothRotation, this.options.animationReverse, this.options.flipHorizontal, this.options.flipVertical);
        this.emojis.forEach(function (emoji) { return emoji.generator = _this.emojiGeneratorList.getGenerator(emoji.generator.namePrefix); });
    };
    Application.prototype.redraw = function () {
        var _this = this;
        this.emojis.forEach(function (emoji) {
            if (_this.options.sourceImage.nonEmpty()) {
                emoji.imageElement.map(function (element) { return element.src = "resources/loading.gif"; });
                emoji.render(_this.options).then(function (isSuccessfully) {
                    if (isSuccessfully) {
                        emoji.checkSize();
                        emoji.updateAttachedImageElement();
                        _this.syncGifs();
                        setTimeout(function () {
                            _this.syncGifs();
                        }, 100);
                    }
                });
            }
        });
    };
    Application.prototype.useNewInputImage = function (blob, fileName) {
        var _this = this;
        this.imagePreview.src = "resources/loading.gif";
        AnimatedImage.fromImage(blob).then(function (maybeImage) { return maybeImage.fold(function (error) {
            _this.imagePreview.src = "resources/transparent.png";
            alert(error);
        }, function (image) {
            _this.imagePreview.src = Utils.imageBlobToDataUrl(blob);
            _this.emojiNameInput.value = fileName.name.substr(0, 96);
            _this.emojiNameInput.disabled = false;
            _this.options.sourceImage = Option.some({
                name: fileName.name,
                image: image
            });
            _this.redraw();
        }); });
    };
    Application.prototype.generateEmojiTable = function (map) {
        var _this = this;
        var table = document.createElement("table");
        table.className = "emojiTable";
        var emojis = [];
        map.forEach(function (row) {
            var rowElement = document.createElement("tr");
            row.forEach(function (emojiRendererName) {
                var emojiElement = document.createElement("img");
                emojiElement.src = "resources/transparent.png";
                emojiElement.className = "emoji";
                if (emojiRendererName == null) {
                }
                else {
                    var newEmoji = new Emoji(_this.emojiGeneratorList.getGenerator(emojiRendererName), _this.emojiSizeWarning);
                    emojiElement.setAttribute("renderer", emojiRendererName);
                    newEmoji.attach(emojiElement);
                    emojis.push(newEmoji);
                }
                rowElement.append(emojiElement);
            });
            table.append(rowElement);
        });
        this.emojis = emojis;
        return table;
    };
    Application.prototype.downloadBlobAsFile = function (blob, filename) {
        var fakeMouseEvent = document.createEvent('MouseEvents');
        var fakeElement = document.createElement('a');
        fakeElement.download = filename;
        fakeElement.href = window.URL.createObjectURL(blob);
        fakeElement.dataset.downloadurl = [blob.type, fakeElement.download, fakeElement.href].join(':');
        fakeMouseEvent.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        fakeElement.dispatchEvent(fakeMouseEvent);
    };
    Application.prototype.downloadRenderedEmojis = function () {
        var _this = this;
        var time = 0;
        this.emojis.forEach(function (emoji) {
            time += .2;
            emoji.renderedGif.forEach(function (gifBlob) {
                return _this.options.sourceImage.forEach(function (imageOptions) {
                    setTimeout(function () { return _this.downloadBlobAsFile(gifBlob, imageOptions.name + "_" + emoji.generator.namePrefix); }, time * 1000);
                });
            });
        });
    };
    return Application;
}());
export { Application };
//# sourceMappingURL=Application.js.map