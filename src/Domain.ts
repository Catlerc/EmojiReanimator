import {fabric} from "./Vendor.js"
import {FabricCanvas, RelativeFabricImage} from "./RelativeImage.js"

export type Milliseconds = number
export type Seconds = number
export type DataUrl = string
export type Renderer = (canvas: FabricCanvas, image: RelativeFabricImage, timeNormalized: number) => Promise<void>

export enum ImageType {
  gif,
  png,
  jpeg,
  jpg
}

export enum StaticImageType {
  png,
  jpeg,
  jpg
}


