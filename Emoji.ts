import {fabric, GifEncoder} from "./Vendor.js"
import {FabricCanvas, FabricImage, RelativeFabricImage, RelativeImage} from "./RelativeImage.js"
import {AnimatedImage} from "./Image/AnimatedImage.js";
import {Image} from "./Image/Image.js";
import {Milliseconds, Utils} from "./Domain.js";
import {StaticImage} from "./Image/StaticImage";


interface Options {
    width: number,
    height: number,
    length: number,
    fps: number
}

export async function createEmoji(
    options: Options,
    image: Image,
    func: (canvas: FabricCanvas, image: RelativeImage, time: Milliseconds, timeNormalized: number) => Promise<void>
) {
    const canvas = Utils.createCanvas(options.width, options.height)
    const gifEncoder = new GifEncoder({
        workers: 2,
        quality: 1,
        background: 0xFFFFFF,
        //transparent: 0xFEFEFE,
        width: options.width,
        height: options.height,
        workerScript: "./vendor/gif.worker.js"
    })
    const totalFrames = Math.floor(options.length * options.fps)
    const delay = 1000 / options.fps

    const relativeImage = new RelativeImage(image)
    relativeImage.attach(canvas)
    relativeImage.rescaleToFit(canvas.width, canvas.height)

    for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
        canvas.clear()
        canvas.setBackgroundColor('#FFFFFF', null)
        let timeNormalized = frameIndex / totalFrames
        await func(canvas, relativeImage, options.length * timeNormalized, timeNormalized)
        canvas.renderAll()
        gifEncoder.addFrame(canvas.contextContainer.getImageData(0, 0, options.width, options.height), {delay: delay})
    }

    return new Promise(
        resolve => {
            gifEncoder.on('finished', resolve)
            gifEncoder.render()
        })
}

export async function createEmojiDynamic(
    options: Options,
    image: AnimatedImage,
    func: (canvas: FabricCanvas, image: RelativeImage, time: Milliseconds, timeNormalized: number) => Promise<void>
) {
    options.length = image.length()
    options.fps = Math.floor(image.frames.length / options.length)
    return createEmoji(options, image, func)
}