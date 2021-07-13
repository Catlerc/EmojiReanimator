import {Emoji} from "./Image/Emoji.js"
import {Seconds} from "./Domain.js"
import {AnimatedImage} from "./Image/AnimatedImage.js"
import {Option} from "./Utils/Option.js"
import {Utils} from "./Utils/Utils.js"
import {EmojiGenerator} from "./EmojiGenerator/EmojiGenerator.js"
import {EmojiSizeWarning} from "./EmojiSizeWarning.js"


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
  anotherRotation: boolean
}


export class Application {
  emojies: Emoji[] = []
  options: Options = {
    width: 64,
    height: 64,
    sourceImage: Option.none(),
    expandTimeline: Option.none(),
    anotherRotation: false
  }
  emojiSizeWarning: EmojiSizeWarning

  constructor(
    private emojiNameInput: HTMLInputElement,
    private fileInput: HTMLInputElement,
    private smileSizeInput: HTMLInputElement,
    private compressionInput: HTMLInputElement,
    private forceAnimateInput: HTMLInputElement,
    private animationLengthInput: HTMLInputElement,
    private fpsInput: HTMLInputElement,
    private imagePreview: HTMLImageElement,
    private downloadButton: HTMLButtonElement,
    private anotherRotationInput: HTMLInputElement,
  ) {
    this.reloadOptions()
    this.emojiSizeWarning = new EmojiSizeWarning()
    this.emojiSizeWarning.updateRoot(document.body)
  }

  inputChange() {
    this.reloadOptions()
    this.redraw()
  }

  initializeEvents() {
    this.emojiNameInput.onchange = () => this.reloadOptions()
    this.smileSizeInput.onchange = () => this.inputChange()
    this.compressionInput.onchange = () => this.inputChange()
    this.animationLengthInput.onchange = () => this.inputChange()
    this.fpsInput.onchange = () => this.inputChange()
    this.anotherRotationInput.onchange = () => this.inputChange()
    this.forceAnimateInput.onchange = () => {
      if (this.forceAnimateInput.checked) {
        this.animationLengthInput.disabled = false
        this.fpsInput.disabled = false
      } else {
        this.animationLengthInput.disabled = true
        this.fpsInput.disabled = true
      }

      this.inputChange()
    }
    this.fileInput.onchange = (event: any) => {

      const fileList = event.target.files
      const file: File = fileList.item(0)
      const reader = new FileReader()
      if (file) {
        this.imagePreview.src = "resources/loading.gif"
        reader.onloadend = () => this.onFileSelection(file, reader.result as ArrayBuffer)
        setTimeout(() => reader.readAsArrayBuffer(file), 10)
      }
    }

    this.downloadButton.onclick = () => this.downloadRenderedEmojies()
  }

  syncGifs() {
    // noinspection SillyAssignmentJS
    this.emojies.forEach(emoji => emoji.imageElement.forEach(imgElement => imgElement.src = imgElement.src))
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
    const newEmojiName = this.emojiNameInput.value
    this.options = {
      sourceImage: oldOptions.sourceImage.map(options => {
        options.name = newEmojiName
        return options
      }),
      width: size,
      height: size,
      expandTimeline: expandTimelineOptions,
      anotherRotation: this.anotherRotationInput.checked
    }

    this.emojies.forEach(emoji =>
      emoji.generator = this.options.anotherRotation ?
        Option.fromValue(EmojiGenerator.anotherRotationGenerators.get(emoji.generator.namePrefix)).getOrElse(emoji.generator) :
        Option.fromValue(EmojiGenerator.allGenerators.get(emoji.generator.namePrefix)).getOrElse(emoji.generator))
  }

  redraw() {
    this.emojies.forEach(emoji => {
      if (this.options.sourceImage.nonEmpty()) {
        emoji.imageElement.map(element => element.src = "resources/loading.gif")
        emoji.stopRender().then(_ =>
          emoji.render(this.options).then(isSuccessfully => {
            if (isSuccessfully) {
              emoji.checkSize()
              emoji.updateAttachedImageElement()
              this.syncGifs()
            }
          })
        )

      }
    })
  }

  onFileSelection(file: File, data: ArrayBuffer) {
    const fileName = file.name.split(".")
    const fileExtension = fileName.pop()

    AnimatedImage.fromImage(data, fileExtension).then(image => {
      this.imagePreview.src = Utils.arrayBufferToUrl(data, fileExtension)
      this.emojiNameInput.value = fileName[0].substr(0, 96)
      this.emojiNameInput.disabled = false
      this.options.sourceImage = Option.some({
        name: fileName[0],
        image: image.right
      })
      this.redraw()
    })
  }

  generateEmojiTable(map: (string | null)[][]): HTMLTableElement {
    const table = document.createElement("table")
    table.className = "emojiTable"
    const emojies: Emoji[] = []
    map.forEach(row => {
      const rowElement = document.createElement("tr")
      row.forEach(emojiRendererName => {
        const emojiElement = document.createElement("img")
        emojiElement.src = "resources/transparent.png"
        emojiElement.className = "emoji"
        if (emojiRendererName == null) {
        } else {
          const newEmoji = new Emoji(EmojiGenerator.allGenerators.get(emojiRendererName), this.emojiSizeWarning)
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
    let time = 0
    this.emojies.forEach(emoji => {
      time += .2
      emoji.renderedGif.forEach(gifBlob =>
        this.options.sourceImage.forEach(imageOptions => {
          setTimeout(() => this.downloadBlobAsFile(gifBlob, imageOptions.name + "_" + emoji.generator.namePrefix), time * 1000)
        })
      )
    })
  }
}