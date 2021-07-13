import {Application} from "./Application.js"

const emojiTable: (string | null)[][] = [
  ["dr", "lr", "ld", "rd", "dl", null],
  ["du", "rc", "ud", "ur", "lu", null],
  ["ru", "rl", "ul", null, null, null]
]

const emojiTableContainer = document.getElementById("emojiTableContainer")

const app = new Application(
  document.getElementById("emojiNameInput") as HTMLInputElement,
  document.getElementById("fileInput") as HTMLInputElement,
  document.getElementById("redrawButton") as HTMLButtonElement,
  document.getElementById("smileSizeInput") as HTMLInputElement,
  document.getElementById("gifCompressionInput") as HTMLInputElement,
  document.getElementById("forceAnimateInput") as HTMLInputElement,
  document.getElementById("animationLengthInput") as HTMLInputElement,
  document.getElementById("gifFpsInput") as HTMLInputElement,
  document.getElementById("imagePreview") as HTMLImageElement,
  document.getElementById("downloadButton") as HTMLButtonElement,
  document.getElementById("syncGifs") as HTMLButtonElement,
  document.getElementById("anotherRotation") as HTMLInputElement
)
app.initializeEvents()
emojiTableContainer.append(app.generateEmojiTable(emojiTable))