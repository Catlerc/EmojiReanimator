import {FrameGenerator, LinearGenerator} from "./FrameGenerator.js"
import {AnimatedImage, Frame, FrameType, ImageUpdateFrame} from "../Image/AnimatedImage.js"
import {Options} from "../Application.js"
import {RelativeImage} from "../Image/RelativeImage/RelativeImage.js"
import {Utils} from "../Utils/Utils.js"
import {RelativeFabricImage} from "../Image/RelativeImage/RelativeFabricImage.js"
import {FabricCanvas} from "../FabricWrapper/FabricCanvas";

export class EmojiGenerator {
  constructor(
    public namePrefix: string,
    public frameGenerator: FrameGenerator,
    public rotation: number = 0
  ) {
  }

  private prepareCanvas(canvas: FabricCanvas) {
    canvas.clear()
    canvas.setBackgroundColor("#FFFFFF", null)

  }

  async generate(image: AnimatedImage, options: Options): Promise<AnimatedImage> {
    let timeline: Array<Frame> = []
    const relativeImage = new RelativeImage(image)

    relativeImage.rescaleToFit(options.width, options.height)

    let currentImage: RelativeFabricImage
    let lastFrameTime: number
    for (const frame of image.timeline) {
      const index = image.timeline.indexOf(frame)
      if (frame.type !== FrameType.End) {
        const canvas = Utils.createCanvas(options.width, options.height)
        relativeImage.attach(canvas)
        const timeNormalized = index / (image.timeline.length - 1)

        if (frame.type == FrameType.ImageUpdate) {
          currentImage = await relativeImage.getFabricImageForFrame(frame as ImageUpdateFrame)
        }

        this.prepareCanvas(canvas)

        const relativeFabricImages = await this.frameGenerator(currentImage, timeNormalized)
        relativeFabricImages.forEach(img => canvas.add(img.underlying))

        canvas.renderAll()

        const imageData = canvas.contextContainer.getImageData(0, 0, options.width, options.height)

        this.prepareCanvas(canvas)

        const imageForRotation = await Utils.fabricImageFromDataUrl(Utils.imageDataToDataUrl(imageData))
        imageForRotation.set({
          originX: "center",
          originY: "center",
          angle: this.rotation,
          left: canvas.width / 2,
          top: canvas.height / 2
        })
        canvas.add(imageForRotation)
        canvas.renderAll()


        timeline.push(new ImageUpdateFrame(canvas.contextContainer.getImageData(0, 0, options.width, options.height), frame.time))
        lastFrameTime = frame.time
      } else
        timeline.push(frame)
    }


    return new AnimatedImage(options.width, options.height, timeline)
  }

  static allGenerators: Map<string, EmojiGenerator> = new Map([
    new EmojiGenerator("lr", LinearGenerator),
    new EmojiGenerator("ud", LinearGenerator, 90)
  ].map(renderer => [renderer.namePrefix, renderer]))
}
