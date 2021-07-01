import {Application} from "./Application.js"

const emojiTable: (string | null)[][] = [
  ["dr", "lr", "ld"],
  ["du", null, "ud"],
  ["ru", "rl", "ul"]
]

const emojiTableContainer = document.getElementById("emojiTableContainer")

const app = new Application(
  document.getElementById("file-input") as HTMLInputElement,
  document.getElementById("redrawButton") as HTMLButtonElement,
  document.getElementById("SmileSizeInput") as HTMLInputElement,
  document.getElementById("GifCompressionInput") as HTMLInputElement,
  document.getElementById("ForceAnimateInput") as HTMLInputElement,
  document.getElementById("AnimationLengthInput") as HTMLInputElement,
  document.getElementById("GifFpsInput") as HTMLInputElement,
  document.getElementById("imagePreview") as HTMLImageElement,
  document.getElementById("downloadButton") as HTMLButtonElement,
  document.getElementById("syncGifs") as HTMLButtonElement
)
app.initializeEvents()
emojiTableContainer.append(app.generateEmojiTable(emojiTable))