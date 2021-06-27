import { Application } from "./Application.js";
var input = document.getElementById("file-input");
var redrawButton = document.getElementById("redrawButton");
var smileSizeInput = document.getElementById("SmileSizeInput");
var compressionInput = document.getElementById("GifCompressionInput");
var forceAnimateInput = document.getElementById("ForceAnimateInput");
var animationLengthInput = document.getElementById("AnimationLengthInput");
var fpsInput = document.getElementById("GifFpsInput");
var app = new Application(input, redrawButton, smileSizeInput, compressionInput, forceAnimateInput, animationLengthInput, fpsInput);
app.initializeEvents();
//# sourceMappingURL=Main.js.map