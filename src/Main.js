import { Application } from "./Application.js";
var emojiTable = [
    ["dr", "lr", "ld", "rd", "dl", null],
    ["du", "rc", "ud", "ur", "lu", null],
    ["ru", "rl", "ul", null, null, null]
];
var emojiTableContainer = document.getElementById("emojiTableContainer");
var app = new Application(document.getElementById("emojiNameInput"), document.getElementById("fileInput"), document.getElementById("redrawButton"), document.getElementById("smileSizeInput"), document.getElementById("gifCompressionInput"), document.getElementById("forceAnimateInput"), document.getElementById("animationLengthInput"), document.getElementById("gifFpsInput"), document.getElementById("imagePreview"), document.getElementById("downloadButton"), document.getElementById("syncGifs"), document.getElementById("anotherRotation"));
app.initializeEvents();
emojiTableContainer.append(app.generateEmojiTable(emojiTable));
//# sourceMappingURL=Main.js.map