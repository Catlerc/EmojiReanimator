import {
  FrameGenerator,
  LinearGenerator,
  Reverse,
  RotationGenerator,
  TurnGenerator,
  TurnGeneratorFlex
} from "./FrameGenerator.js"
import {AnimatedImage, Frame, FrameType, ImageUpdateFrame, Pixels} from "../Image/AnimatedImage.js"
import {Options} from "../Application.js"
import {RelativeImage} from "../Image/RelativeImage/RelativeImage.js"
import {Utils} from "../Utils/Utils.js"
import {RelativeFabricImage} from "../Image/RelativeImage/RelativeFabricImage.js"
import {FabricCanvas} from "../FabricWrapper/FabricCanvas.js"
import {ImagePreprocess} from "./ImagePreprocess.js"

export class EmojiGenerator {
  constructor(
    public namePrefix: string,
    public frameGenerator: FrameGenerator,
    public rotation: number = 0,
    public preprocess: ImagePreprocess[] = []
  ) {
  }

  private static prepareCanvas(canvas: FabricCanvas) {
    canvas.clear()
    canvas.setBackgroundColor("#FFFFFF", null)
  }

  async generate(image: AnimatedImage, options: Options, cancelCheck: () => boolean): Promise<AnimatedImage> {
    let timeline: Array<Frame> = []
    const relativeImage = new RelativeImage(image)

    relativeImage.rescaleToFit(options.width, options.height)

    let currentImage: RelativeFabricImage
    let lastFrameTime: number
    for (const frame of image.timeline) {
      if (cancelCheck()) break

      const index = image.timeline.indexOf(frame)
      if (frame.type !== FrameType.End) {
        const canvas = Utils.createCanvas(options.width, options.height)
        relativeImage.attach(canvas)
        const timeNormalized = index / (image.timeline.length - 1)

        if (frame.type == FrameType.ImageUpdate) {
          const imageUpdateFrame = frame as ImageUpdateFrame
          let pixelsRaw = imageUpdateFrame.image
          this.preprocess.forEach(preprocess => {
            pixelsRaw = preprocess(pixelsRaw)
          })
          currentImage = await relativeImage.getFabricImageForFrame(pixelsRaw.toImageData())
        }

        EmojiGenerator.prepareCanvas(canvas)

        const relativeFabricImages = await this.frameGenerator(currentImage, timeNormalized)
        relativeFabricImages.forEach(img => canvas.add(img.underlying))

        canvas.renderAll()

        const imageData = canvas.toCanvasElement().getContext("2d").getImageData(0, 0, options.width, options.height)

        EmojiGenerator.prepareCanvas(canvas)

        const dataUrl = Utils.imageDataToDataUrl(imageData)
        const imageForRotation = await Utils.fabricImageFromDataUrl(dataUrl)
        imageForRotation.set({
          originX: "center",
          originY: "center",
          angle: this.rotation,
          left: canvas.width / 2,
          top: canvas.height / 2
        })
        canvas.add(imageForRotation)
        canvas.renderAll()

        timeline.push(new ImageUpdateFrame(Pixels.fromImageData(canvas.toCanvasElement().getContext("2d").getImageData(0, 0, options.width, options.height)), frame.time))
        lastFrameTime = frame.time
      } else
        timeline.push(frame)
    }


    return new AnimatedImage(options.width, options.height, timeline)
  }


}

