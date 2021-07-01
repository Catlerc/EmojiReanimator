import { Application } from "./Application.js";
var emojiTable = [
    ["dr", "lr", "ld"],
    ["du", null, "ud"],
    ["ru", "rl", "ul"]
];
var emojiTableContainer = document.getElementById("emojiTableContainer");
var app = new Application(document.getElementById("file-input"), document.getElementById("redrawButton"), document.getElementById("SmileSizeInput"), document.getElementById("GifCompressionInput"), document.getElementById("ForceAnimateInput"), document.getElementById("AnimationLengthInput"), document.getElementById("GifFpsInput"), document.getElementById("imagePreview"), document.getElementById("downloadButton"), document.getElementById("syncGifs"));
app.initializeEvents();
emojiTableContainer.append(app.generateEmojiTable(emojiTable));
//# sourceMappingURL=Main.js.map