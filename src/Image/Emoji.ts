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
  addFrame(imageData: ImageData, options: GifEncoderFrameOptions): void

  on(eventName: string, func: (event: any) => any): void

  render(): void
}


export class Emoji {
  renderedGif: Option<Blob> = Option.none<Blob>()
  imageElement: Option<HTMLImageElement> = Option.none<HTMLImageElement>()

  constructor(public generator: EmojiGenerator, private emojiSizeWarning: EmojiSizeWarning) {
  }

  attach(imageElement: HTMLImageElement) {
    this.imageElement = Option.some(imageElement)
    imageElement.onmouseenter = () => {
      this.emojiSizeWarning.updatePosition(imageElement)
      this.renderedGif.forEach(gif => {
        if (gif.size > 128 * 1024)
          this.emojiSizeWarning.setText(`The size of the gif (${Math.ceil(gif.size / 1024)} Kb) is larger than\nthe maximum size of Slack emoji (128 Kb).`)
        else
          this.emojiSizeWarning.hide()
      })
      if (!this.renderedGif.nonEmpty()) this.emojiSizeWarning.hide()
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

  async render(options: Options) {
    // noinspection ES6MissingAwait
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

      const animatedImage = await this.generator.generate(image, options)

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
        this.renderedGif = Option.some(gif)
        this.afterRender()
      })
      gifEncoder.render()
    })
  }

  afterRender() {
    this.updateAttachedImageElement()
    this.imageElement.forEach(imageElement => {
      this.renderedGif.forEach(gif => {
        const maxSize = 128 * 1024 //128 Kb
        if (gif.size > maxSize) {
          imageElement.setAttribute("sizefailure", null)
        } else imageElement.removeAttribute("sizefailure")
      })
    })
  }
}
