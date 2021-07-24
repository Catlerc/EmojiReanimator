import {Emoji} from "./Image/Emoji.js"
import {Seconds} from "./Domain.js"
import {AnimatedImage} from "./Image/AnimatedImage.js"
import {Option} from "./Utils/Option.js"
import {Utils} from "./Utils/Utils.js"
import {EmojiSizeWarning} from "./EmojiSizeWarning.js"
import {EmojiGeneratorList} from "./EmojiGenerator/EmojiGeneratorList.js"


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
  SmoothRotation: boolean,
  animationReverse: boolean,
  flipHorizontal: boolean,
  flipVertical: boolean
}


export class Application {
  emojis: Emoji[] = []
  options: Options = {
    width: 64,
    height: 64,
    sourceImage: Option.none(),
    expandTimeline: Option.none(),
    SmoothRotation: true,
    animationReverse: false,
    flipHorizontal: false,
    flipVertical: false
  }
  emojiSizeWarning: EmojiSizeWarning
  emojiGeneratorList: EmojiGeneratorList

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
    private smoothRotationInput: HTMLInputElement,
    private animationReverseInput: HTMLInputElement,
    private flipHorizontalInput: HTMLInputElement,
    private flipVerticalInput: HTMLInputElement,
    private imageByUrlDiv: HTMLInputElement,
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
    this.animationReverseInput.onchange = () => this.inputChange()
    this.flipHorizontalInput.onchange = () => this.inputChange()
    this.flipVerticalInput.onchange = () => this.inputChange()
    this.animationLengthInput.onchange = () => this.inputChange()
    this.fpsInput.onchange = () => this.inputChange()
    this.smoothRotationInput.onchange = () => this.inputChange()
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
    this.imageByUrlDiv.onclick = async () => {
      const url = await navigator.clipboard.readText()
      const request = await fetch(url, {
        mode: "no-cors",
        cache: "no-cache",
        method: "GET",
        referrerPolicy: "no-referrer"
      })
      const arrayBuffer = await request.arrayBuffer()
      const maybeImageArrayBuffer: Option<ArrayBuffer> = request.ok ? Option.some<ArrayBuffer>(arrayBuffer) : Option.none<ArrayBuffer>()
      // const arrayBuffer = await r.arrayBuffer()

      //   .catch((e  ) => {
      //   console.log(e)
      //   Option.none<ArrayBuffer>()
      // })
      maybeImageArrayBuffer.fold(
        () => alert(`Изображение с url '${url}' не удалось получить`),
        arrayBuffer => this.useNewInputImage(arrayBuffer, url.match(/.+\/(.+)$/)[1])
      )
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
      this.fileInput.value = ""
    }

    this.downloadButton.onclick = () => this.downloadRenderedEmojis()
  }

  syncGifs() {
    // noinspection SillyAssignmentJS
    this.emojis.forEach(emoji => emoji.imageElement.forEach(imgElement => imgElement.src = imgElement.src))
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
      SmoothRotation: this.smoothRotationInput.checked,
      animationReverse: this.animationReverseInput.checked,
      flipHorizontal: this.flipHorizontalInput.checked,
      flipVertical: this.flipVerticalInput.checked
    }
    this.emojiGeneratorList = new EmojiGeneratorList(
      this.options.SmoothRotation,
      this.options.animationReverse,
      this.options.flipHorizontal,
      this.options.flipVertical
    )
    this.emojis.forEach(emoji => emoji.generator = this.emojiGeneratorList.getGenerator(emoji.generator.namePrefix))
  }

  redraw() {
    this.emojis.forEach(emoji => {
      if (this.options.sourceImage.nonEmpty()) {
        emoji.imageElement.map(element => element.src = "resources/loading.gif")
        emoji.render(this.options).then(isSuccessfully => {
          if (isSuccessfully) {
            emoji.checkSize()
            emoji.updateAttachedImageElement()
            this.syncGifs()
            setTimeout(() => {
              this.syncGifs()// иногда не синхронизируются сгенеренные эмодзи
            }, 100)
          }
        })
      }
    })
  }

  onFileSelection(file: File, data: ArrayBuffer) {
    this.useNewInputImage(data, file.name)
  }

  useNewInputImage(data: ArrayBuffer, fullFileName: string) {
    const fileName = fullFileName.split(".")
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
    const emojis: Emoji[] = []
    map.forEach(row => {
      const rowElement = document.createElement("tr")
      row.forEach(emojiRendererName => {
        const emojiElement = document.createElement("img")
        emojiElement.src = "resources/transparent.png"
        emojiElement.className = "emoji"
        if (emojiRendererName == null) {
        } else {
          const newEmoji = new Emoji(this.emojiGeneratorList.getGenerator(emojiRendererName), this.emojiSizeWarning)
          emojiElement.setAttribute("renderer", emojiRendererName)
          newEmoji.attach(emojiElement)
          emojis.push(newEmoji)
        }
        rowElement.append(emojiElement)
      })
      table.append(rowElement)
    })

    this.emojis = emojis
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

  downloadRenderedEmojis() {
    let time = 0
    this.emojis.forEach(emoji => {
      time += .2
      emoji.renderedGif.forEach(gifBlob =>
        this.options.sourceImage.forEach(imageOptions => {
          setTimeout(() => this.downloadBlobAsFile(gifBlob, imageOptions.name + "_" + emoji.generator.namePrefix), time * 1000)
        })
      )
    })
  }
}