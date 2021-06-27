import {GifEncoder} from "./Vendor.js"
import {FabricCanvas, RelativeFabricImage, RelativeImage} from "./RelativeImage.js"
import {AnimatedImage, FrameType, ImageUpdateFrame} from "./AnimatedImage.js";
import {Milliseconds, Renderer, Seconds} from "./Domain.js";
import {Option} from "./Utils/Option.js";
import {Options} from "./Application.js";
import {Utils} from "./Utils/Utils.js";


interface GifEncoderFrameOptions {
  delay: Milliseconds
}

interface GifEncoder {
  addFrame(imageData: ImageData, options: GifEncoderFrameOptions): void

  on(eventName: string, func: (event: any) => any): void

  render(): void
}


export class Emoji {
  namePostfix: string
  renderedGif: Option<Blob> = Option.none()
  renderer: Renderer
  imageElement: Option<HTMLImageElement> = Option.none()

  constructor(namePostfix: string, renderer: Renderer) {
    this.namePostfix = namePostfix
    this.renderer = renderer
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


    const canvas = Utils.createCanvas(options.width, options.height)
    const gifEncoder: GifEncoder = new GifEncoder({
      workers: 2,
      quality: 100,
      background: 0xFFFFFF,
      width: options.width,
      height: options.height,
      workerScript: "./vendor/gif.worker.js"
    })

    const relativeImage = new RelativeImage(image)
    relativeImage.attach(canvas)
    relativeImage.rescaleToFit(options.width, options.height)

    let oldImage: RelativeFabricImage
    for (let frameIndex = 0; frameIndex < image.timeline.length - 1; frameIndex++) {
      const frame = image.timeline[frameIndex]
      const nextFrame = image.timeline[frameIndex + 1]
      const delay = (nextFrame.time - frame.time) * 1000
      const timeNormalized = frameIndex / (image.timeline.length - 1)

      if (frame.type == FrameType.ImageUpdate) {
        oldImage = await relativeImage.getFabricImageForFrame(frame as ImageUpdateFrame)
      }

      canvas.clear()
      canvas.setBackgroundColor('#FFFFFF', null)

      await this.renderer(canvas, oldImage, timeNormalized)

      canvas.renderAll()

      gifEncoder.addFrame(
        canvas.contextContainer.getImageData(0, 0, options.width, options.height),
        {delay: delay}
      )
    }

    return new Promise(
      resolve => {
        gifEncoder.on('finished', (gif: Blob) => {
          this.renderedGif = Option.some(gif)
          this.updateAttachedImageElement()
          resolve(gif)
        })
        gifEncoder.render()
      })
  }
}
