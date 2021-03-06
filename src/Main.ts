import {Application} from "./Application.js"

const emojiTable: (string | null)[][] = [
  ["dr", "lr", "ld", "rd", "dl"],
  ["du", "just", "ud", "ur", "lu"],
  ["ru", "rl", "ul", "shake", "rotation"]
]

const emojiTableContainer = document.getElementById("emojiTableContainer")

const app = new Application(
  document.getElementById("emojiNameInput") as HTMLInputElement,
  document.getElementById("fileInput") as HTMLInputElement,
  document.getElementById("smileSizeInput") as HTMLInputElement,
  document.getElementById("gifCompressionInput") as HTMLInputElement,
  document.getElementById("forceAnimateInput") as HTMLInputElement,
  document.getElementById("animationLengthInput") as HTMLInputElement,
  document.getElementById("gifFpsInput") as HTMLInputElement,
  document.getElementById("imagePreview") as HTMLImageElement,
  document.getElementById("downloadButton") as HTMLButtonElement,
  document.getElementById("smoothRotation") as HTMLInputElement,
  document.getElementById("animationReverseInput") as HTMLInputElement,
  document.getElementById("flipHorizontalInput") as HTMLInputElement,
  document.getElementById("flipVerticalInput") as HTMLInputElement,
  document.getElementById("imagePreviewLightUrl") as HTMLInputElement
)
app.initializeEvents()
emojiTableContainer.append(app.generateEmojiTable(emojiTable))