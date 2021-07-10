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
import {FlipHorizontal, FlipVertical, ImagePreprocess} from "./ImagePreprocess.js"

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
          const imageUpdateFrame = frame as ImageUpdateFrame
          let pixelsRaw = imageUpdateFrame.image
          this.preprocess.forEach(preprocess => {
            pixelsRaw = preprocess(pixelsRaw)
          })
          const pixels = pixelsRaw
          currentImage = await relativeImage.getFabricImageForFrame(pixels.toImageData())//pixels.toImageData())
        }

        EmojiGenerator.prepareCanvas(canvas)

        const relativeFabricImages = await this.frameGenerator(currentImage, timeNormalized)
        relativeFabricImages.forEach(img => canvas.add(img.underlying))

        canvas.renderAll()

        const imageData = canvas.contextContainer.getImageData(0, 0, options.width, options.height)

        EmojiGenerator.prepareCanvas(canvas)

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

        timeline.push(new ImageUpdateFrame(Pixels.fromImageData(canvas.contextContainer.getImageData(0, 0, options.width, options.height)), frame.time))
        lastFrameTime = frame.time
      } else
        timeline.push(frame)
    }


    return new AnimatedImage(options.width, options.height, timeline)
  }

  static allGenerators: Map<string, EmojiGenerator> = new Map([
    new EmojiGenerator("lr", LinearGenerator, 0),
    new EmojiGenerator("ud", LinearGenerator, 90),
    new EmojiGenerator("rl", LinearGenerator, 180),
    new EmojiGenerator("du", LinearGenerator, 270),
    new EmojiGenerator("ld", TurnGeneratorFlex, 0),
    new EmojiGenerator("ul", TurnGeneratorFlex, 90),
    new EmojiGenerator("ru", TurnGeneratorFlex, 180),
    new EmojiGenerator("dr", TurnGeneratorFlex, 270),
    new EmojiGenerator("rc", RotationGenerator, 0),
    new EmojiGenerator("h_lr", Reverse(LinearGenerator), 0, [FlipHorizontal]),
    new EmojiGenerator("h_ud", Reverse(LinearGenerator), 90, [FlipHorizontal]),
    new EmojiGenerator("h_rl", Reverse(LinearGenerator), 180, [FlipHorizontal]),
    new EmojiGenerator("h_du", Reverse(LinearGenerator), 270, [FlipHorizontal]),
    new EmojiGenerator("h_ld", Reverse(TurnGeneratorFlex), 0, [FlipHorizontal]),
    new EmojiGenerator("h_ul", Reverse(TurnGeneratorFlex), 90, [FlipHorizontal]),
    new EmojiGenerator("h_ru", Reverse(TurnGeneratorFlex), 180, [FlipHorizontal]),
    new EmojiGenerator("h_dr", Reverse(TurnGeneratorFlex), 270, [FlipHorizontal]),
    new EmojiGenerator("h_rc", Reverse(RotationGenerator), 0, [FlipHorizontal]),
  ].map(renderer => [renderer.namePrefix, renderer]))
}

