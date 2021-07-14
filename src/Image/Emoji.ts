import {GifEncoder} from "../Vendor.js"
import {AnimatedImage, FrameType, ImageUpdateFrame, Pixels} from "./AnimatedImage.js"
import {Milliseconds} from "../Domain.js"
import {Option} from "../Utils/Option.js"
import {Options} from "../Application.js"
import {Utils} from "../Utils/Utils.js"
import {EmojiGenerator} from "../EmojiGenerator/EmojiGenerator.js"
import {EmojiSizeWarning} from "../EmojiSizeWarning.js"


interface GifEncoderFrameOptions {
  delay: Milliseconds
}

interface GifEncoder {
  freeWorkers: Worker[]
  running: string

  abort(): void

  addFrame(imageData: ImageData, options: GifEncoderFrameOptions): void

  on(eventName: string, func: (event: any) => any): void

  render(): void
}

export enum EmojiState {
  Idle,
  Rendering,
  Stopping
}

export class Emoji {
  renderedGif: Option<Blob> = Option.none<Blob>()
  imageElement: Option<HTMLImageElement> = Option.none<HTMLImageElement>()
  renderId: number = 0
  overSize: boolean = false

  constructor(public generator: EmojiGenerator, private emojiSizeWarning: EmojiSizeWarning) {
  }

  attach(imageElement: HTMLImageElement) {
    this.imageElement = Option.some(imageElement)
    imageElement.onmouseenter = () => {
      if (this.overSize) {
        this.emojiSizeWarning.updatePosition(imageElement)
        this.renderedGif.forEach(gif => {
          if (gif.size > 128 * 1024)
            this.emojiSizeWarning.setText(`Размер эмодзи превышает лимит slack'a (${Math.ceil(gif.size / 1024)} Kb > 128 kb).`)
          else
            this.emojiSizeWarning.hide()
        })
        if (!this.renderedGif.nonEmpty()) this.emojiSizeWarning.hide()
      } else
        this.emojiSizeWarning.hide()

    }
    imageElement.onmouseleave = () => this.emojiSizeWarning.hide()
  }

  updateAttachedImageElement() {
    this.imageElement.forEach(
      imageElement => this.renderedGif.forEach(gif => {
        imageElement.src = Utils.imageBlobToDataUrl(gif)
      })
    )
  }

  private static cleanup(gifEncoder: GifEncoder) {
    gifEncoder.freeWorkers.forEach(worker => worker.terminate())
  }

  async render(options: Options): Promise<boolean> {
    this.setOverSize(false)
    const currentRenderId = Math.floor(Math.random() * 99999999999)
    this.renderId = currentRenderId

    return new Promise<boolean>(resolve =>
      options.sourceImage.forEach(async imageOptions => {
        let image = imageOptions.image
        options.expandTimeline.map(expandTimelineOptions =>
          image = image.expandTimeline(expandTimelineOptions.length, expandTimelineOptions.fps)
        )

        const gifEncoder: GifEncoder = new GifEncoder({
          workers: 2,
          quality: 100,
          background: 0xFFFFFF,
          width: options.width,
          height: options.height,
          workerScript: "./vendor/gif.worker.js"
        })

        const animatedImage = await this.generator.generate(image, options, () => this.renderId != currentRenderId)
        if (this.renderId != currentRenderId) {
          Emoji.cleanup(gifEncoder)
          resolve(false)
        }
        for (let index = 0; index < animatedImage.timeline.length - 1; index++) {
          const frame = animatedImage.timeline[index] as ImageUpdateFrame
          const nextFrame = animatedImage.timeline[index + 1]
          const delay = (nextFrame.time - frame.time) * 1000
          gifEncoder.addFrame(
            frame.image.toImageData(),
            {delay: delay}
          )
        }

        gifEncoder.on("finished", (gif: Blob) => {
          Emoji.cleanup(gifEncoder)
          if (this.renderId == currentRenderId) {
            this.renderedGif = Option.some(gif)
            resolve(true)
          } else resolve(false)
        })
        gifEncoder.render()
      })
    )
  }

  checkSize() {
    this.imageElement.forEach(imageElement => {
      this.renderedGif.forEach(gif => {
        const maxSize = 128 * 1024 //128 Kb
        this.setOverSize(gif.size > maxSize)
      })
    })
  }

  setOverSize(overSize: boolean) {
    this.overSize = overSize
    this.imageElement.forEach(imageElement => {
      if (overSize)
        imageElement.setAttribute("sizefailure", null)
      else
        imageElement.removeAttribute("sizefailure")
    })
  }
}
