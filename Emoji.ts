import {fabric, GifEncoder} from "./Vendor.js"
import {FabricCanvas, FabricImage, RelativeImage} from "./RelativeImage.js"

function createImage(imageUrl: string): Promise<FabricImage> {
    return new Promise(resolve => fabric.Image.fromURL(imageUrl, resolve))
}

function createCanvas(width: number, height: number) {
    const renderer = document.createElement('canvas')
    renderer.width = width
    renderer.height = height


    return new fabric.Canvas(renderer)
}

interface Options {
    width: number,
    height: number,
    length: number,
    fps: number
}

export async function createEmoji(
    options: Options,
    imageURL: string,
    func: (canvas: FabricCanvas, image: RelativeImage, t: number) => Promise<void>
) {
    const canvas = createCanvas(options.width, options.height)
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
    const fabricImage = await createImage(imageURL)
    const relativeImage = new RelativeImage(fabricImage)
    relativeImage.attach(canvas)
    relativeImage.rescaleToFit(canvas.width, canvas.height)
    relativeImage.setPos(0.5, 0.5)

    for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
        canvas.clear()
        canvas.setBackgroundColor('#FFFFFF', null)
        relativeImage.attach(canvas)
        await func(canvas, relativeImage, frameIndex / totalFrames)
        canvas.renderAll()
        gifEncoder.addFrame(canvas.contextContainer.getImageData(0, 0, options.width, options.height), {delay: delay})
    }

    return new Promise(
        resolve => {
            gifEncoder.on('finished', resolve)
            gifEncoder.render()
        })
}