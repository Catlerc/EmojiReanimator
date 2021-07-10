import { Application } from "./Application.js";
var emojiTable = [
    ["dr", "lr", "ld", "rd_h", "rl_h", "dl_h"],
    ["du", "rc", "ud", "ud_h", "rc_h", "du_h"],
    ["ru", "rl", "ul", "ur_h", "lr_h", "lu_h"]
];
var emojiTableContainer = document.getElementById("emojiTableContainer");
var app = new Application(document.getElementById("EmojiNameInput"), document.getElementById("file-input"), document.getElementById("redrawButton"), document.getElementById("SmileSizeInput"), document.getElementById("GifCompressionInput"), document.getElementById("ForceAnimateInput"), document.getElementById("AnimationLengthInput"), document.getElementById("GifFpsInput"), document.getElementById("imagePreview"), document.getElementById("downloadButton"), document.getElementById("syncGifs"), document.getElementById("AnotherRotation"));
app.initializeEvents();
emojiTableContainer.append(app.generateEmojiTable(emojiTable));
//# sourceMappingURL=Main.js.map