import {Application} from "./Application.js"

const emojiTable: (string | null)[][] = [
  ["dr", "lr", "ld", "rd", "dl", null],
  ["du", "rc", "ud", "ur", "lu", null],
  ["ru", "rl", "ul", null, null, null]
]

const emojiTableContainer = document.getElementById("emojiTableContainer")

const app = new Application(
  document.getElementById("EmojiNameInput") as HTMLInputElement,
  document.getElementById("file-input") as HTMLInputElement,
  document.getElementById("redrawButton") as HTMLButtonElement,
  document.getElementById("SmileSizeInput") as HTMLInputElement,
  document.getElementById("GifCompressionInput") as HTMLInputElement,
  document.getElementById("ForceAnimateInput") as HTMLInputElement,
  document.getElementById("AnimationLengthInput") as HTMLInputElement,
  document.getElementById("GifFpsInput") as HTMLInputElement,
  document.getElementById("imagePreview") as HTMLImageElement,
  document.getElementById("downloadButton") as HTMLButtonElement,
  document.getElementById("syncGifs") as HTMLButtonElement,
  document.getElementById("AnotherRotation") as HTMLInputElement
)
app.initializeEvents()
emojiTableContainer.append(app.generateEmojiTable(emojiTable))