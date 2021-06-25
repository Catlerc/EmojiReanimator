import {RelativeImage} from "./RelativeImage"
import {GifFile} from "./Vendor.js"
import {Either, Left, Right} from "./Either.js";

type Milliseconds = number

interface Frame {
    image: ImageData,
    delay: Milliseconds,
}

enum StaticImageTypes {
    png,
    jpeg,
    jpg
}

export class AnimatedImage {
    frames: Array<Frame>
    width: number
    height: number

    isStatic(): boolean {
        return this.frames.length == 1
    }

    constructor(width: number, height: number, frames: Array<Frame>) {
        this.frames = frames
        this.width = width
        this.height = height
    }

    static fromGIF(gifBuffer: ArrayBuffer) {
        let file = new GifFile(gifBuffer)
        let newFrames: Array<Frame> = []
        file.frames.forEach((frame: any) => {
            let renderer = document.createElement('canvas')
            renderer.width = file.canvasWidth
            renderer.height = file.canvasHeight
            let rendererContext = renderer.getContext('2d');
            for (let pixel = 0; pixel < frame.pixelColors.length; pixel++) {
                rendererContext.fillStyle = frame.pixelColors[pixel];
                rendererContext.fillRect(pixel % file.canvasWidth, Math.floor(pixel / file.canvasWidth), 1, 1);
            }
            newFrames.push({
                image: rendererContext.getImageData(0, 0, renderer.width, renderer.height),
                delay: frame.delayTime
            })
        })
        return new AnimatedImage(file.canvasWidth, file.canvasHeight, newFrames)
    }

    static fromStaticImage(imageBuffer: ArrayBuffer, type: StaticImageTypes) {
        const blob = new Blob([imageBuffer], {type: "image/" + type.toString()});
        const urlCreator = window.URL || window.webkitURL;
        const imageUrl = urlCreator.createObjectURL(blob);

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

                resolve(new AnimatedImage(image.width, image.height, [{image: imageData, delay: 0}]))
            }
        })
    }

    static async fromImage(imageBuffer: ArrayBuffer, extension: string): Promise<Either<Error, AnimatedImage>> {
        if (extension == "gif")
            return new Right(this.fromGIF(imageBuffer))
        if (extension in StaticImageTypes)
            return new Right(await this.fromStaticImage(imageBuffer, extension as unknown as StaticImageTypes))

        return new Left(new Error(`unsupported file extension '${extension}'`))
    }
}