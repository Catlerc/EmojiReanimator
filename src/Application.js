import { Emoji } from "./Image/Emoji.js";
import { AnimatedImage } from "./Image/AnimatedImage.js";
import { Option } from "./Utils/Option.js";
import { Utils } from "./Utils/Utils.js";
import { EmojiGenerator } from "./EmojiGenerator/EmojiGenerator.js";
import { EmojiSizeWarning } from "./EmojiSizeWarning.js";
var Application = (function () {
    function Application(emojiNameInput, fileInput, redrawButton, smileSizeInput, compressionInput, forceAnimateInput, animationLengthInput, fpsInput, imagePreview, downloadButton, syncGifsButton) {
        this.emojiNameInput = emojiNameInput;
        this.fileInput = fileInput;
        this.redrawButton = redrawButton;
        this.smileSizeInput = smileSizeInput;
        this.compressionInput = compressionInput;
        this.forceAnimateInput = forceAnimateInput;
        this.animationLengthInput = animationLengthInput;
        this.fpsInput = fpsInput;
        this.imagePreview = imagePreview;
        this.downloadButton = downloadButton;
        this.syncGifsButton = syncGifsButton;
        this.emojies = [];
        this.options = {
            width: 64,
            height: 64,
            sourceImage: Option.none(),
            expandTimeline: Option.none()
        };
        this.reloadOptions();
        this.emojiSizeWarning = new EmojiSizeWarning();
        this.emojiSizeWarning.updateRoot(document.body);
    }
    Application.prototype.initializeEvents = function () {
        var _this = this;
        this.emojiNameInput.onchange = function () { return _this.reloadOptions(); };
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
        this.downloadButton.onclick = function () { return _this.downloadRenderedEmojies(); };
        this.syncGifsButton.onclick = function () {
            _this.emojies.forEach(function (emoji) { return emoji.imageElement.forEach(function (imgElement) { return imgElement.src = imgElement.src; }); });
        };
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
        var newEmojiName = this.emojiNameInput.value;
        this.options = {
            sourceImage: oldOptions.sourceImage.map(function (options) {
                options.name = newEmojiName;
                return options;
            }),
            width: size,
            height: size,
            expandTimeline: expandTimelineOptions
        };
    };
    Application.prototype.redraw = function () {
        var _this = this;
        this.options.sourceImage.forEach(function (imageOptions) {
            return _this.emojies.forEach(function (emoji) {
                emoji.imageElement.map(function (element) { return element.src = "resources/loading.gif"; });
                emoji.render(_this.options);
            });
        });
    };
    Application.prototype.onFileSelection = function (file, data) {
        var _this = this;
        var fileName = file.name.split(".");
        var fileExtension = fileName.pop();
        AnimatedImage.fromImage(data, fileExtension).then(function (image) {
            _this.imagePreview.src = Utils.arrayBufferToUrl(data, fileExtension);
            _this.emojiNameInput.value = fileName[0].substr(0, 96);
            _this.emojiNameInput.disabled = false;
            _this.options.sourceImage = Option.some({
                name: fileName[0],
                image: image.right
            });
            _this.redraw();
        });
    };
    Application.prototype.generateEmojiTable = function (map) {
        var _this = this;
        var table = document.createElement("table");
        table.className = "emojiTable";
        var emojies = [];
        map.forEach(function (row) {
            var rowElement = document.createElement("tr");
            row.forEach(function (emojiRendererName) {
                var emojiElement = document.createElement("img");
                emojiElement.src = "resources/transparent.png";
                emojiElement.className = "emoji";
                if (emojiRendererName == null) {
                }
                else {
                    var newEmoji = new Emoji(EmojiGenerator.allGenerators.get(emojiRendererName), _this.emojiSizeWarning);
                    emojiElement.setAttribute("renderer", emojiRendererName);
                    newEmoji.attach(emojiElement);
                    emojies.push(newEmoji);
                }
                rowElement.append(emojiElement);
            });
            table.append(rowElement);
        });
        this.emojies = emojies;
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
    Application.prototype.downloadRenderedEmojies = function () {
        var _this = this;
        this.emojies.forEach(function (emoji) {
            return emoji.renderedGif.forEach(function (gifBlob) {
                return _this.options.sourceImage.forEach(function (imageOptions) {
                    _this.downloadBlobAsFile(gifBlob, imageOptions.name + "_" + emoji.generator.namePrefix);
                });
            });
        });
    };
    return Application;
}());
export { Application };
//# sourceMappingURL=Application.js.map