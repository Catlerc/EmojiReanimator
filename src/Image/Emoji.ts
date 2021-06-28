import {GifEncoder} from "../Vendor.js"
import {AnimatedImage, FrameType, ImageUpdateFrame} from "./AnimatedImage.js"
import {Milliseconds} from "../Domain.js"
import {Option} from "../Utils/Option.js"
import {Options} from "../Application.js"
import {Utils} from "../Utils/Utils.js"
import {EmojiGenerator} from "../EmojiGenerator/EmojiGenerator.js"


interface GifEncoderFrameOptions {
  delay: Milliseconds
}

interface GifEncoder {
  addFrame(imageData: ImageData, options: GifEncoderFrameOptions): void

  on(eventName: string, func: (event: any) => any): void

  render(): void
}


export class Emoji {
  renderedGif: Option<Blob> = Option.none()
  renderedName: Option<string> = Option.none()
  imageElement: Option<HTMLImageElement> = Option.none()

  constructor(private generator: EmojiGenerator) {
  }

  attach(imageElement: HTMLImageElement) {
    this.imageElement = Option.some(imageElement)
  }

  updateAttachedImageElement() {
    this.imageElement.forEach(
      imageElement => this.renderedGif.forEach(gif => {
        imageElement.src = Utils.imageBlobToDataUrl(gif)
        if (gif.size > 128 * 1024)
          imageElement.setAttribute("sizefailure", null)
        else
          imageElement.removeAttribute("sizefailure")
      })
    )
  }

  async render(
    options: Options,
    imageRaw: AnimatedImage
  ) {
    let image = imageRaw
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
        frame.image,
        {delay: delay}
      )
    }
    this.renderedName = options.name.map(name => name + "_" + this.generator.namePrefix)

    return new Promise(
      resolve => {
        gifEncoder.on("finished", (gif: Blob) => {
          this.renderedGif = Option.some(gif)
          this.updateAttachedImageElement()
          resolve(gif)
        })
        gifEncoder.render()
      })
  }
}
