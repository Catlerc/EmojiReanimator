import { Application } from "./Application.js";
var emojiTable = [
    [null, "lr", null],
    [null, null, "ud"],
    [null, null, null]
];
var emojiTableContainer = document.getElementById("emojiTableContainer");
var app = new Application(document.getElementById("file-input"), document.getElementById("redrawButton"), document.getElementById("SmileSizeInput"), document.getElementById("GifCompressionInput"), document.getElementById("ForceAnimateInput"), document.getElementById("AnimationLengthInput"), document.getElementById("GifFpsInput"), document.getElementById("imagePreview"), document.getElementById("downloadButton"));
app.initializeEvents();
emojiTableContainer.append(app.generateEmojiTable(emojiTable));
//# sourceMappingURL=Main.js.map