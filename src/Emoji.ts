import {GifEncoder} from "./Vendor.js"
import {FabricCanvas, RelativeFabricImage, RelativeImage} from "./RelativeImage.js"
import {AnimatedImage, FrameType, ImageUpdateFrame} from "./AnimatedImage.js";
import {Seconds, Utils} from "./Domain.js";


interface ExpandTimelineOptions {
    length: Seconds,
    fps: number
}

interface Options {
    width: number,
    height: number,
    expandTimeline?: ExpandTimelineOptions
}

export async function createEmoji(
    options: Options,
    imageRaw: AnimatedImage,
    func: (canvas: FabricCanvas, image: RelativeFabricImage, timeNormalized: number) => Promise<void>
) {
    let image = imageRaw
    if (options.expandTimeline !== undefined) image = image.expandTimeline(options.expandTimeline.length, options.expandTimeline.fps)


    const canvas = Utils.createCanvas(options.width, options.height)
    const gifEncoder = new GifEncoder({
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
        const timeNormalized = frameIndex / (image.timeline.length-1)

        if (frame.type == FrameType.ImageUpdate) {
            oldImage = await relativeImage.getFabricImageForFrame(frame as ImageUpdateFrame)
        }

        canvas.clear()
        canvas.setBackgroundColor('#FFFFFF', null)

        await func(canvas, oldImage, timeNormalized)

        canvas.renderAll()

        gifEncoder.addFrame(
            canvas.contextContainer.getImageData(0, 0, options.width, options.height),
            {delay: delay}
        )
    }

    return new Promise(
        resolve => {
            gifEncoder.on('finished', resolve)
            gifEncoder.render()
        })
}
