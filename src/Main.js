import { Application } from "./Application.js";
var emojiTable = [
    ["dr", "lr", "ld", "rd", "dl"],
    ["du", "rotation", "ud", "ur", "lu"],
    ["ru", "rl", "ul", "shake", "just"]
];
var emojiTableContainer = document.getElementById("emojiTableContainer");
var app = new Application(document.getElementById("emojiNameInput"), document.getElementById("fileInput"), document.getElementById("smileSizeInput"), document.getElementById("gifCompressionInput"), document.getElementById("forceAnimateInput"), document.getElementById("animationLengthInput"), document.getElementById("gifFpsInput"), document.getElementById("imagePreview"), document.getElementById("downloadButton"), document.getElementById("anotherRotation"), document.getElementById("animationReverseInput"), document.getElementById("flipHorizontalInput"), document.getElementById("flipVerticalInput"));
app.initializeEvents();
emojiTableContainer.append(app.generateEmojiTable(emojiTable));
//# sourceMappingURL=Main.js.map