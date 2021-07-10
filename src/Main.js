import { Application } from "./Application.js";
var emojiTable = [
    ["dr", "lr", "ld", "h_dr", "h_lr", "h_ld"],
    ["du", "rc", "ud", "h_du", "h_rc", "h_ud"],
    ["ru", "rl", "ul", "h_ru", "h_rl", "h_ul"]
];
var emojiTableContainer = document.getElementById("emojiTableContainer");
var app = new Application(document.getElementById("EmojiNameInput"), document.getElementById("file-input"), document.getElementById("redrawButton"), document.getElementById("SmileSizeInput"), document.getElementById("GifCompressionInput"), document.getElementById("ForceAnimateInput"), document.getElementById("AnimationLengthInput"), document.getElementById("GifFpsInput"), document.getElementById("imagePreview"), document.getElementById("downloadButton"), document.getElementById("syncGifs"));
app.initializeEvents();
emojiTableContainer.append(app.generateEmojiTable(emojiTable));
//# sourceMappingURL=Main.js.map