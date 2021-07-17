import {RelativeFabricImage} from "../Image/RelativeImage/RelativeFabricImage.js"
import {fabric} from "../Vendor.js"
import {KeyValuePair} from "../Domain"

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
    image.setPos(.5, .5)
    image.set({
      originX: "center",
      originY: "center",
      angle: 360 * time
    })
    return [image]
  }

export const TurnGenerator: FrameGenerator =
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
        angle: 90 * (time + 0.5)
      })
    }

    return [copy0, copy]
  }

const linesN = 24

export const TurnGeneratorFlex: FrameGenerator =
  async (image, time) => {
    function createSlices(copies: Array<KeyValuePair<number, RelativeFabricImage>>, time: number) {
      time = time - 0.005
      const sliceWidth = image.underlying.width / linesN
      const computedCopies = copies.map(pair => {
        const index = pair.key
        const copy = pair.value
        copy.set({
          originX: index / (linesN),
          angle: 90 * (time + index / (linesN - .5))
        })

        copy.setPos(0, 1)

        const rate = 1
        const w = sliceWidth * rate
        const h = copy.underlying.height


        const upXR = 1.4
        const upYR = 0.99
        const leftXR = 1
        const leftYR = 0.5
        const footXR = 0.3
        copy.underlying.clipPath =
          new fabric.Path(`M ${w * footXR} 0 L ${-w * footXR} 0 L ${-w * leftXR} ${-h * leftYR} L ${-w * upXR} ${-h * upYR} L 0 ${-h} L ${w * upXR} ${-h * upYR} L ${w * leftXR} ${-h * leftYR} L ${w * footXR} 0 z`, {
            originX: 0.5,
            top: -copy.underlying.height / 2,
            left: sliceWidth * index - copy.underlying.width / 2
          })
        return copy
      })
      let tmp: RelativeFabricImage[] = []
      let linesHalfN = linesN / 2
      for (let i = 0; i < linesHalfN; i++) {
        const otherSideIndex = linesHalfN * 2 - i - 1
        tmp = [...tmp, computedCopies[i], computedCopies[otherSideIndex]]
      }
      return tmp.reverse()
    }

    image.setPos(0, 1)
    image.set({
      originX: 0,
      originY: "bottom",
      angle: 90 * time
    })
    const copies1 = await image.copyN(linesN)
    const copies2 = await image.copyN(linesN)


    const layers1 = createSlices(copies1, time - 1)
    const layers2 = createSlices(copies2, time)

    return [...layers1, ...layers2]
  }

export function Reverse(underlying: FrameGenerator): FrameGenerator {
  return async (image: RelativeFabricImage, timeNormalized: number) => {
    const newImage = await image.copy()

    return await underlying(newImage, 1 - timeNormalized)
  }
}

export const Shake: FrameGenerator =
  async (image, _) => {
    image.setPos(0.5 + (Math.random() - 0.5) / 10, 0.5 + (Math.random() - 0.5) / 10)
    image.set({
      angle: 10 * (Math.random() - 0.5)
    })
    return [image]
  }

export const Just: FrameGenerator =
  async (image, _) => {
    image.setPos(0.5, 0.5)
    return [image]
  }