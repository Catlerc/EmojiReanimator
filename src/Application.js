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
import { Emoji } from "./Emoji.js";
import { renderers } from "./Renderers/Renderers.js";
import { AnimatedImage } from "./AnimatedImage.js";
import { Option } from "./Utils/Option.js";
import { Utils } from "./Utils/Utils.js";
var Application = (function () {
    function Application(fileInput, redrawButton, smileSizeInput, compressionInput, forceAnimateInput, animationLengthInput, fpsInput, imagePreview) {
        this.fileInput = fileInput;
        this.redrawButton = redrawButton;
        this.smileSizeInput = smileSizeInput;
        this.compressionInput = compressionInput;
        this.forceAnimateInput = forceAnimateInput;
        this.animationLengthInput = animationLengthInput;
        this.fpsInput = fpsInput;
        this.imagePreview = imagePreview;
        this.image = Option.none();
        this.options = {
            name: Option.none(),
            width: 64,
            height: 64,
            expandTimeline: Option.none()
        };
        this.reloadOptions();
    }
    Application.prototype.initializeEvents = function () {
        var _this = this;
        this.redrawButton.onclick = function () { return _this.redraw(); };
        this.smileSizeInput.onchange = function () { return _this.reloadOptions(); };
        this.compressionInput.onchange = function () { return _this.reloadOptions(); };
        this.animationLengthInput.onchange = function () { return _this.reloadOptions(); };
        this.fpsInput.onchange = function () { return _this.reloadOptions(); };
        this.forceAnimateInput.onchange = function () {
            if (_this.forceAnimateInput.checked) {
                _this.animationLengthInput.disabled = false;
                _this.fpsInput.disabled = false;
            }
            else {
                _this.animationLengthInput.disabled = true;
                _this.fpsInput.disabled = true;
            }
            _this.reloadOptions();
        };
        this.fileInput.onchange = function (event) {
            var fileList = event.target.files;
            var file = fileList.item(0);
            var reader = new FileReader();
            reader.onloadend = function () { return _this.onFileSelection(file, reader.result); };
            reader.readAsArrayBuffer(file);
        };
        this.emojies = Array.from(document.getElementsByClassName("Emoji")).map(function (element) {
            var rendererType = element.getAttribute("renderer");
            var renderer = renderers.get(rendererType);
            var emoji = new Emoji(rendererType, renderer);
            emoji.attach(element);
            return emoji;
        });
    };
    Application.prototype.reloadOptions = function () {
        var oldOptions = this.options;
        var size = Number(this.smileSizeInput.value);
        var expandTimelineOptions = Option.none();
        if (this.forceAnimateInput.checked)
            expandTimelineOptions = Option.some({
                length: Number(this.animationLengthInput.value),
                fps: Number(this.fpsInput.value)
            });
        this.options = {
            name: oldOptions.name,
            width: size,
            height: size,
            expandTimeline: expandTimelineOptions
        };
    };
    Application.prototype.redraw = function () {
        var _this = this;
        this.image.forEach(function (image) {
            return _this.emojies.forEach(function (emoji) {
                emoji.imageElement.map(function (element) { return element.src = "resources/loading.gif"; });
                emoji.render(_this.options, image);
            });
        });
    };
    Application.prototype.onFileSelection = function (file, data) {
        return __awaiter(this, void 0, void 0, function () {
            var fileExtension, image;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fileExtension = file.name.split('.').pop();
                        return [4, AnimatedImage.fromImage(data, fileExtension)];
                    case 1:
                        image = _a.sent();
                        this.imagePreview.src = Utils.arrayBufferToUrl(data, fileExtension);
                        this.image = Option.some(image.right);
                        this.redraw();
                        return [2];
                }
            });
        });
    };
    return Application;
}());
export { Application };
//# sourceMappingURL=Application.js.map