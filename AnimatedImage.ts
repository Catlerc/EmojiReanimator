import {GifFile} from "./Vendor.js"
import {Either, Left, Right} from "./Either.js";
import {ImageType, Seconds, StaticImageType, Utils} from "./Domain.js";


export enum FrameType {
    ImageUpdate,
    Update,
    End
}

class UpdateFrame implements Frame {
    type = FrameType.Update
    time: Seconds;

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

class EndFrame implements Frame {
    type = FrameType.ImageUpdate
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


    static fromGIF(gifBuffer: ArrayBuffer) {
        const file = new GifFile(gifBuffer)
        let newTimeline: Array<Frame> = []
        let timer = 0
        file.frames.forEach((frame: any) => {
            let renderer = document.createElement('canvas')
            renderer.width = file.canvasWidth
            renderer.height = file.canvasHeight
            let rendererContext = renderer.getContext('2d');
            for (let pixel = 0; pixel < frame.pixelColors.length; pixel++) {
                rendererContext.fillStyle = frame.pixelColors[pixel];
                rendererContext.fillRect(pixel % file.canvasWidth, Math.floor(pixel / file.canvasWidth), 1, 1);
            }
            const imageData = rendererContext.getImageData(0, 0, renderer.width, renderer.height)
            newTimeline.push(new ImageUpdateFrame(imageData, timer))
            timer += frame.delayTime
        })
        newTimeline.push(new EndFrame(timer))
        return new AnimatedImage(file.canvasWidth, file.canvasHeight, newTimeline)
    }

    static async fromImage(imageBuffer: ArrayBuffer, extension: string): Promise<Either<Error, AnimatedImage>> {
        if (extension == "gif")
            return new Right(AnimatedImage.fromGIF(imageBuffer))
        if (extension in StaticImageType)
            return new Right(await AnimatedImage.fromStaticImage(imageBuffer, extension as unknown as StaticImageType))
        return new Left(new Error(`unsupported file extension '${extension}'`))
    }

    static fromStaticImage(imageBuffer: ArrayBuffer, type: StaticImageType) {
        const imageUrl = Utils.arrayBufferToUrl(imageBuffer, type.toString())

        let image = new Image()
        image.src = imageUrl
        return new Promise<AnimatedImage>(resolve => {
            image.onload = () => {
                const canvas = document.createElement('canvas')
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


