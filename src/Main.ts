import {Application} from "./Application.js"

const emojiTable: (string | null)[][] = [
  ["dr", "lr", "ld", "h_dr", "h_lr", "h_ld"],
  ["du", "rc", "ud", "h_du", "h_rc", "h_ud"],
  ["ru", "rl", "ul", "h_ru", "h_rl", "h_ul"]
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
  document.getElementById("syncGifs") as HTMLButtonElement
)
app.initializeEvents()
emojiTableContainer.append(app.generateEmojiTable(emojiTable))