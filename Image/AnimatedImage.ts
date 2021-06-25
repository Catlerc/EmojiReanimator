import {ImageType, Milliseconds, Seconds} from "../Domain.js";
import {GifFile} from "../Vendor.js";
import {Frame, Image} from "./Image.js";


export class AnimatedImage implements Image {
    type: ImageType = ImageType.gif
    frames: Array<Frame>
    width: number
    height: number

    isStatic(): boolean {
        return this.frames.length == 1
    }

    length(): Milliseconds {
        let totalLength = 0;
        this.frames.forEach(frame => totalLength += frame.delay)
        return totalLength
    }

    constructor(width: number, height: number, frames: Array<Frame>) {
        this.frames = frames
        this.width = width
        this.height = height
    }

    frameByTime(time: Seconds): Frame {
        if (this.isStatic()) return this.frames[0]

        let normalizedTime = time % this.length()
        if (isNaN(normalizedTime)) return this.frames[0]

        let length = 0
        for (const frame of this.frames) {

            if (length < time && length + frame.delay > time) return frame
            length += frame.delay
        }
        return this.frames[this.frames.length - 1]
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

}