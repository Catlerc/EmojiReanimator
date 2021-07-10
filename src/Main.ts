import {Application} from "./Application.js"

const emojiTable: (string | null)[][] = [
  ["dr", "lr", "ld", "rd_h", "rl_h", "dl_h"],
  ["du", "rc", "ud", "ud_h", "rc_h", "du_h"],
  ["ru", "rl", "ul", "ur_h", "lr_h", "lu_h"]
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