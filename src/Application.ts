import {Emoji} from "./Image/Emoji.js"
import {DataUrl, Seconds} from "./Domain.js"
import {AnimatedImage} from "./Image/AnimatedImage.js"
import {Option} from "./Utils/Option.js"
import {Utils} from "./Utils/Utils.js"
import {EmojiGenerator} from "./EmojiGenerator/EmojiGenerator.js"


export interface ImageOptions {
  image: AnimatedImage,
  name: string
}

export interface ExpandTimelineOptions {
  length: Seconds,
  fps: number
}

export interface Options {
  sourceImage: Option<ImageOptions>
  width: number
  height: number
  expandTimeline: Option<ExpandTimelineOptions>
}


export class Application {
  emojies: Emoji[] = []
  options: Options = {
    width: 64,
    height: 64,
    sourceImage: Option.none(),
    expandTimeline: Option.none()
  }

  constructor(
    private fileInput: HTMLInputElement,
    private redrawButton: HTMLButtonElement,
    private smileSizeInput: HTMLInputElement,
    private compressionInput: HTMLInputElement,
    private forceAnimateInput: HTMLInputElement,
    private animationLengthInput: HTMLInputElement,
    private fpsInput: HTMLInputElement,
    private imagePreview: HTMLImageElement,
    private downloadButton: HTMLButtonElement
  ) {
    this.reloadOptions()
  }

  initializeEvents() {
    this.redrawButton.onclick = () => this.redraw()
    this.smileSizeInput.onchange = () => this.reloadOptions()
    this.compressionInput.onchange = () => this.reloadOptions()
    this.animationLengthInput.onchange = () => this.reloadOptions()
    this.fpsInput.onchange = () => this.reloadOptions()
    this.forceAnimateInput.onchange = () => {
      if (this.forceAnimateInput.checked) {
        this.animationLengthInput.disabled = false
        this.fpsInput.disabled = false
      } else {
        this.animationLengthInput.disabled = true
        this.fpsInput.disabled = true
      }

      this.reloadOptions()
    }
    this.fileInput.onchange = (event: any) => {
      this.imagePreview.src = "resources/loading.gif"
      const fileList = event.target.files
      const file: File = fileList.item(0)
      const reader = new FileReader()
      reader.onloadend = () => this.onFileSelection(file, reader.result as ArrayBuffer)
      setTimeout(() => reader.readAsArrayBuffer(file), 10)
    }

    this.emojies = Array.from(document.getElementsByClassName("Emoji")).map(
      element => {
        const rendererType = element.getAttribute("renderer")
        const renderer = EmojiGenerator.allGenerators.get(rendererType)
        const emoji = new Emoji(renderer)
        emoji.attach(element as HTMLImageElement)
        return emoji
      }
    )

    this.downloadButton.onclick = () => this.downloadRenderedEmojies()
  }

  reloadOptions() {
    const oldOptions = this.options
    const size = Number(this.smileSizeInput.value)
    let expandTimelineOptions = Option.none<ExpandTimelineOptions>()
    if (this.forceAnimateInput.checked)
      expandTimelineOptions = Option.some(
        {
          length: Number(this.animationLengthInput.value),
          fps: Number(this.fpsInput.value)
        }
      )
    this.options = {
      sourceImage: oldOptions.sourceImage,
      width: size,
      height: size,
      expandTimeline: expandTimelineOptions
    }
  }

  redraw() {
    this.options.sourceImage.forEach(imageOptions =>
      this.emojies.forEach(emoji => {
        emoji.imageElement.map(element => element.src = "resources/loading.gif")
        // noinspection JSIgnoredPromiseFromCall
        emoji.render(this.options)
      }))

  }

  onFileSelection(file: File, data: ArrayBuffer) {
    const fileName = file.name.split(".")
    const fileExtension = fileName.pop()

    AnimatedImage.fromImage(data, fileExtension).then(image => {
      this.imagePreview.src = Utils.arrayBufferToUrl(data, fileExtension)
      this.options.sourceImage = Option.some({
        name: fileName[0],
        image: image.right
      })
      this.redraw()
    })
  }

  generateEmojiTable(map: (string | null)[][]): HTMLTableElement {
    const table = document.createElement("table")
    const emojies: Emoji[] = []
    map.forEach(row => {
      const rowElement = document.createElement("tr")
      row.forEach(emojiRendererName => {
        const emojiElement = document.createElement("img")
        emojiElement.src = "resources/transparent.png"
        emojiElement.className = "emoji"
        if (emojiRendererName == null) {
        } else {
          const newEmoji = new Emoji(EmojiGenerator.allGenerators.get(emojiRendererName))
          emojiElement.setAttribute("renderer", emojiRendererName)
          newEmoji.attach(emojiElement)
          emojies.push(newEmoji)
        }
        rowElement.append(emojiElement)
      })
      table.append(rowElement)
    })

    this.emojies = emojies
    return table
  }

  downloadBlobAsFile(blob: Blob, filename: string) {
    const fakeMouseEvent = document.createEvent('MouseEvents')
    const fakeElement = document.createElement('a')

    fakeElement.download = filename
    fakeElement.href = window.URL.createObjectURL(blob)
    fakeElement.dataset.downloadurl = [blob.type, fakeElement.download, fakeElement.href].join(':')
    fakeMouseEvent.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    fakeElement.dispatchEvent(fakeMouseEvent)
  }

  downloadRenderedEmojies() {
    this.emojies.forEach(emoji =>
      emoji.renderedGif.forEach(gifBlob =>
        emoji.renderedName.forEach(name =>
          this.downloadBlobAsFile(gifBlob, name)
        )
      )
    )
  }
}