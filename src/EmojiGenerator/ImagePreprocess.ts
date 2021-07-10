import {Pixels} from "../Image/AnimatedImage.js"

export type ImagePreprocess = (_: Pixels) => Pixels


export const FlipVertical: ImagePreprocess = (pixels: Pixels) => {
  return new Pixels([...pixels.data].reverse())
}
export const FlipHorizontal: ImagePreprocess = (pixels: Pixels) => {
  return new Pixels([...pixels.data].map(a => [...a].reverse()))
}