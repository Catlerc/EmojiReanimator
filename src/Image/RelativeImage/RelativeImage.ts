import {AnimatedImage, ImageUpdateFrame} from "../AnimatedImage.js"
import {Utils} from "../../Utils/Utils.js"
import {RelativeFabricImage} from "./RelativeFabricImage.js"
import {FabricCanvas} from "../../FabricWrapper/FabricCanvas.js"
import {FabricImage} from "../../FabricWrapper/FabricImage.js"


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

  async getFabricImageForFrame(frame: ImageData): Promise<RelativeFabricImage> {
    let fabricImage = await Utils.fabricImageFromDataUrl(Utils.imageDataToDataUrl(frame))
    fabricImage.set({
      originX: "center",
      originY: "center",
    })
    return new RelativeFabricImage(fabricImage.scale(this.scale), this.canvas)
  }

  rescaleToFit(width: number, height: number): void {
    this.scale = Math.min(width / this.image.width, height / this.image.height)
    this.width = this.width * this.scale
    this.height = this.height * this.scale
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