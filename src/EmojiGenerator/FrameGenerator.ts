import {RelativeFabricImage} from "../Image/RelativeImage/RelativeFabricImage.js"

export type FrameGenerator = (image: RelativeFabricImage, timeNormalized: number) => Promise<RelativeFabricImage[]>

export const LinearGenerator: FrameGenerator =
  async (image, time) => {
    const clone = await image.copy()

    image.setPos(time + 0.5, 0.5)
    clone.setPos((time - 1) + 0.5, 0.5)
    return [image, clone]
  }

export const RotationGenerator: FrameGenerator =
  async (image, time) => {
    const copy0 = await image.copy()
    const copy = await image.copy()

    if (time <= 0.5)
      copy0.setPos(time - 0.5, 0.5)
    else {
      copy0.setPos(0, 1)
      copy0.set({
        originX: "center",
        originY: "bottom",
        angle: 90 * (time - 0.5)
      })
    }

    if (time >= 0.5) {
      copy.set({
        angle: 90
      })
      copy.setPos(0.5, time + 0.5)
    } else {
      copy.setPos(0, 1)
      copy.set({
        originX: "center",
        originY: "bottom",
        angle: 90 * (time+0.5)
      })
    }

    return [copy0, copy]
  }
