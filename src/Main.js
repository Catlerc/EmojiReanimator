import { Application } from "./Application.js";
var emojiTable = [
    ["dr", "lr", "ld", "rd", "dl"],
    ["du", "just", "ud", "ur", "lu"],
    ["ru", "rl", "ul", "shake", "rotation"]
];
var emojiTableContainer = document.getElementById("emojiTableContainer");
var app = new Application(document.getElementById("emojiNameInput"), document.getElementById("fileInput"), document.getElementById("smileSizeInput"), document.getElementById("gifCompressionInput"), document.getElementById("forceAnimateInput"), document.getElementById("animationLengthInput"), document.getElementById("gifFpsInput"), document.getElementById("imagePreview"), document.getElementById("downloadButton"), document.getElementById("smoothRotation"), document.getElementById("animationReverseInput"), document.getElementById("flipHorizontalInput"), document.getElementById("flipVerticalInput"), document.getElementById("imagePreviewLightUrl"));
app.initializeEvents();
emojiTableContainer.append(app.generateEmojiTable(emojiTable));
//# sourceMappingURL=Main.js.map