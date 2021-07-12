import { Application } from "./Application.js";
var emojiTable = [
    ["dr", "lr", "ld", "rd", "dl", null],
    ["du", "rc", "ud", "ur", "lu", null],
    ["ru", "rl", "ul", null, null, null]
];
var emojiTableContainer = document.getElementById("emojiTableContainer");
var app = new Application(document.getElementById("EmojiNameInput"), document.getElementById("file-input"), document.getElementById("redrawButton"), document.getElementById("SmileSizeInput"), document.getElementById("GifCompressionInput"), document.getElementById("ForceAnimateInput"), document.getElementById("AnimationLengthInput"), document.getElementById("GifFpsInput"), document.getElementById("imagePreview"), document.getElementById("downloadButton"), document.getElementById("syncGifs"), document.getElementById("AnotherRotation"));
app.initializeEvents();
emojiTableContainer.append(app.generateEmojiTable(emojiTable));
//# sourceMappingURL=Main.js.map