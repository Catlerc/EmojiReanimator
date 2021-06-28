import { Application } from "./Application.js";
var emojiTable = [
    [null, "lr", null],
    [null, null, "ud"],
    [null, null, null]
];
var input = document.getElementById("file-input");
var redrawButton = document.getElementById("redrawButton");
var smileSizeInput = document.getElementById("SmileSizeInput");
var compressionInput = document.getElementById("GifCompressionInput");
var forceAnimateInput = document.getElementById("ForceAnimateInput");
var animationLengthInput = document.getElementById("AnimationLengthInput");
var fpsInput = document.getElementById("GifFpsInput");
var previewImage = document.getElementById("imagePreview");
var mainBlock = document.getElementById("mainBlock");
var app = new Application(input, redrawButton, smileSizeInput, compressionInput, forceAnimateInput, animationLengthInput, fpsInput, previewImage);
app.initializeEvents();
mainBlock.append(app.generateEmojiTable(emojiTable));
//# sourceMappingURL=Main.js.map