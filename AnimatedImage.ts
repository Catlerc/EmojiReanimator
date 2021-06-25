import {RelativeImage} from "./RelativeImage"
import {GifFile} from "./Vendor.js"

type Milliseconds = number


interface Frame {
    image: ImageData,
    delay: Milliseconds,
}

class AnimatedImage {
    frames: Array<Frame>
    width: number
    height: number

    constructor(width: number, height: number, frames: Array<Frame>) {
        this.frames = frames
        this.width = width
        this.height = height
    }

    static fromGIF(gif: string) {
        let file = new GifFile(gif)
        let newFrames: Array<Frame> = []
        for (const i in file.frames) {
            let frame = file.frames[i]
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
        }
        return new AnimatedImage(file.canvasWidth, file.canvasHeight, newFrames)
    }
}