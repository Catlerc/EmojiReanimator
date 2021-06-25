import {ImageType, Milliseconds, StaticImageType, Utils} from "../Domain.js";
// @ts-ignore
import {Frame, Image as FramedImage} from "./Image.js";
import {AnimatedImage} from "./AnimatedImage.js";

export class StaticImage implements FramedImage {
    type: ImageType
    frame: Frame
    width: number
    height: number

    constructor(width: number, height: number, frame: Frame) {
        this.frame = frame
        this.width = width
        this.height = height
    }

    frameByTime(time: Milliseconds): Frame {
        return this.frame
    }

    static fromStaticImage(imageBuffer: ArrayBuffer, type: StaticImageType) {
        const imageUrl = Utils.arrayBufferToUrl(imageBuffer, type.toString())

        let image = new Image()
        image.src = imageUrl
        return new Promise<StaticImage>(resolve => {
            image.onload = () => {
                const canvas = document.createElement('canvas')
                canvas.width = image.width
                canvas.height = image.height

                const canvasContext = canvas.getContext("2d")
                canvasContext.drawImage(image, 0, 0)

                const imageData = canvasContext.getImageData(0, 0, image.width, image.height)

                resolve(new StaticImage(image.width, image.height, {image: imageData, delay: 0}))
            }
        })
    }
}

