import {Application} from "./Application.js"

const emojiTable: (string | null)[][] = [
  [null, "lr", null],
  [null, null, "ud"],
  [null, null, null]
]

const input = document.getElementById("file-input") as HTMLInputElement
const redrawButton = document.getElementById("redrawButton") as HTMLButtonElement
const smileSizeInput = document.getElementById("SmileSizeInput") as HTMLInputElement
const compressionInput = document.getElementById("GifCompressionInput") as HTMLInputElement
const forceAnimateInput = document.getElementById("ForceAnimateInput") as HTMLInputElement
const animationLengthInput = document.getElementById("AnimationLengthInput") as HTMLInputElement
const fpsInput = document.getElementById("GifFpsInput") as HTMLInputElement
const previewImage = document.getElementById("imagePreview") as HTMLImageElement
const mainBlock = document.getElementById("mainBlock")

const app = new Application(input, redrawButton, smileSizeInput, compressionInput, forceAnimateInput, animationLengthInput, fpsInput, previewImage)
app.initializeEvents()
mainBlock.append(app.generateEmojiTable(emojiTable))