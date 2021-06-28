import {RelativeFabricImage} from "../Image/RelativeImage/RelativeFabricImage.js"

export type FrameGenerator = (image: RelativeFabricImage, timeNormalized: number) => Promise<RelativeFabricImage[]>

export const LinearGenerator: FrameGenerator =
  async (image, time) => {
    const clone = await image.copy()

    image.setPos(time + 0.5, 0.5)
    clone.setPos((time - 1) + 0.5, 0.5)
    return [image, clone]
  }
