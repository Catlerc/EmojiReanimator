import {Milliseconds, Seconds} from "./Domain.js";
import {fabric} from "./Vendor.js";
import {AnimatedImage, ImageUpdateFrame} from "./AnimatedImage.js";
import {Utils} from "./Utils/Utils.js";

export interface Point {
  x: number,
  y: number
}

export type Offset = Point

export interface FabricImage {
  width: number,
  height: number

  scale(scale: number): FabricImage

  getScaledWidth(): number

  getScaledHeight(): number

  set(options: Object): void

  get(paramName: string): number

  clone(callback: (image: FabricImage) => void): Promise<FabricImage>
}

function createImage(imageUrl: string): Promise<FabricImage> {
  return new Promise(resolve => fabric.Image.fromURL(imageUrl, resolve))
}

export interface FabricCanvas {
  add(image: FabricImage): void

  width: number
  height: number
}

export class RelativeImage {
  image: AnimatedImage
  fabricImage: FabricImage
  canvas?: FabricCanvas
  width: number
  height: number
  scale: number = 1

  constructor(image: AnimatedImage) {
    this.image = image
    this.width = image.width
    this.height = image.height
  }

  async getFabricImageForFrame(frame: ImageUpdateFrame): Promise<RelativeFabricImage> {
    let fabricImage = await createImage(Utils.imageDataToDataUrl(frame.image))
    fabricImage.set({
      originX: "center",
      originY: "center",
    })
    return new RelativeFabricImage(fabricImage.scale(this.scale), this.canvas)
  }

  rescaleToFit(width: number, height: number): void {
    this.scale = Math.min(width / this.image.width, height / this.image.height)
    this.width = this.width * this.scale / this.canvas.width
    this.height = this.height * this.scale / this.canvas.height
  }


  attach(canvas: FabricCanvas) {
    this.canvas = canvas
  }

  copy() {
    const clonedRelativeImage = new RelativeImage(this.image)
    clonedRelativeImage.canvas = this.canvas
    clonedRelativeImage.width = this.width
    clonedRelativeImage.height = this.height
    if (clonedRelativeImage.canvas !== null) clonedRelativeImage.canvas.add(clonedRelativeImage.fabricImage)
    return clonedRelativeImage
  }
}


export class RelativeFabricImage {
  underlying: FabricImage
  canvas: FabricCanvas
  width: number
  height: number

  constructor(underlying: FabricImage,
              canvas: FabricCanvas) {
    this.underlying = underlying
    this.canvas = canvas
    this.width = underlying.getScaledWidth()
    this.height = underlying.getScaledHeight()
  }

  setPos(xn: number, yn: number) {
    this.underlying.set({
      left: this.canvas.width * xn,
      top: this.canvas.height * yn
    })
  }

  getPos() {
    return {
      xr: this.underlying.get('left') / this.canvas.width,
      yr: this.underlying.get('top') / this.canvas.height
    }
  }

  async copy() {
    const clonedFabricImage = await new Promise<FabricImage>(resolve => this.underlying.clone(resolve))
    const clonedRelativeImage = new RelativeFabricImage(clonedFabricImage, this.canvas)
    clonedRelativeImage.canvas = this.canvas
    return clonedRelativeImage
  }
}