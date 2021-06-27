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
            _this.imagePreview.src = "resources/loading.gif";
            var fileList = event.target.files;
            var file = fileList.item(0);
            var reader = new FileReader();
            reader.onloadend = function () { return _this.onFileSelection(file, reader.result); };
            setTimeout(function () { return reader.readAsArrayBuffer(file); }, 10);
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
        var _this = this;
        var fileExtension = file.name.split('.').pop();
        AnimatedImage.fromImage(data, fileExtension).then(function (image) {
            _this.imagePreview.src = Utils.arrayBufferToUrl(data, fileExtension);
            _this.image = Option.some(image.right);
            _this.redraw();
        });
    };
    return Application;
}());
export { Application };
//# sourceMappingURL=Application.js.map