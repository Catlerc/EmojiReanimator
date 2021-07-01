import {GifFile} from "../Vendor.js"
import {Either, Left, Right} from "../Utils/Either.js"
import {ImageType, Seconds, StaticImageType} from "../Domain.js"
import {Utils} from "../Utils/Utils.js"


export enum FrameType {
  ImageUpdate,
  Update,
  End
}

export class UpdateFrame implements Frame {
  type = FrameType.Update
  time: Seconds

  constructor(time: Seconds) {
    this.time = time
  }

}

export class ImageUpdateFrame implements Frame {
  type = FrameType.ImageUpdate
  time: Seconds
  image: ImageData

  constructor(image: ImageData, time: Seconds) {
    this.time = time
    this.image = image
  }
}

export class EndFrame implements Frame {
  type = FrameType.End
  time: Seconds

  constructor(time: Seconds) {
    this.time = time
  }
}

export interface Frame {
  time: Seconds
  type: FrameType
}

export class AnimatedImage {
  type: ImageType = ImageType.gif
  timeline: Array<Frame>
  width: number
  height: number


  constructor(width: number, height: number, timeline: Array<Frame>) {
    this.timeline = timeline
    this.width = width
    this.height = height
  }

  expandTimeline(length: Seconds, fps: number) {
    const lastFrame = this.timeline[this.timeline.length - 1]
    if (length <= lastFrame.time) return this

    let newTimeline = this.timeline.slice()
    newTimeline.pop() // remove EndFrame

    const step = length / fps
    let timer = 0
    for (let i = 0; i < Math.floor(length * fps) - 1; i++) {
      timer += step
      newTimeline.push(new UpdateFrame(timer))
    }
    newTimeline.push(new EndFrame(length))
    return new AnimatedImage(this.width, this.height, newTimeline.sort((a, b) => {
      if (a.time < b.time) return -1
      if (a.time > b.time) return 1
      return 0
    }))
  }

  static fromGIF(gifBuffer: ArrayBuffer) {
    const rgbRegex = /rgb\((\d+),(\d+),(\d+)\)/

    const gifFile = new GifFile(gifBuffer)
    let newTimeline: Array<Frame> = []
    let timer = 0
    gifFile.frames.forEach((frame: any) => {
      const frameImageData: number[] = []
      const regexResults: RegExpMatchArray[] = frame.pixelColors.map((pixelColor: string) => pixelColor.match(rgbRegex))
      regexResults.forEach(pixelRegexResult => {
        if (pixelRegexResult !== null) {
          for (let i = 1; i <= 3; i++) frameImageData.push(Number(pixelRegexResult[i]))
          frameImageData.push(255)
        } else
          for (let i = 0; i < 4; i++) frameImageData.push(255)
      })
      const imageData = new ImageData(new Uint8ClampedArray(frameImageData), gifFile.canvasWidth, gifFile.canvasHeight)
      newTimeline.push(new ImageUpdateFrame(imageData, timer))
      timer += frame.delayTime
    })
    newTimeline.push(new EndFrame(timer))
    return new AnimatedImage(gifFile.canvasWidth, gifFile.canvasHeight, newTimeline)
  }

  static fromImage(imageBuffer: ArrayBuffer, extension: string): Promise<Either<Error, AnimatedImage>> {
    return new Promise(async resolve => {
      if (extension == "gif")
        resolve(new Right(AnimatedImage.fromGIF(imageBuffer)))
      else if (extension in StaticImageType)
        resolve(new Right(await AnimatedImage.fromStaticImage(imageBuffer, extension as unknown as StaticImageType)))
      else
        resolve(new Left(new Error(`unsupported file extension '${extension}'`)))
    })
  }

  static fromStaticImage(imageBuffer: ArrayBuffer, type: StaticImageType) {
    const imageUrl = Utils.arrayBufferToUrl(imageBuffer, type.toString())

    let image = new Image()
    image.src = imageUrl
    return new Promise<AnimatedImage>(resolve => {
      image.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = image.width
        canvas.height = image.height

        const canvasContext = canvas.getContext("2d")
        canvasContext.drawImage(image, 0, 0)

        const imageData = canvasContext.getImageData(0, 0, image.width, image.height)

        resolve(new AnimatedImage(image.width, image.height, [
          new ImageUpdateFrame(imageData, 0),
          new EndFrame(0)
        ]))
      }
    })
  }
}


