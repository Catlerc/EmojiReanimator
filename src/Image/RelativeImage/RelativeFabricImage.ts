import {FabricImage} from "../../FabricWrapper/FabricImage.js"
import {FabricCanvas} from "../../FabricWrapper/FabricCanvas.js"

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
      xr: this.underlying.get("left") / this.canvas.width,
      yr: this.underlying.get("top") / this.canvas.height
    }
  }

  async copy() {
    const clonedFabricImage = await new Promise<FabricImage>(resolve => this.underlying.clone(resolve))
    const clonedRelativeImage = new RelativeFabricImage(clonedFabricImage, this.canvas)
    clonedRelativeImage.canvas = this.canvas
    return clonedRelativeImage
  }
}