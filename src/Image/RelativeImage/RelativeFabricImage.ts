import {FabricImage} from "../../FabricWrapper/FabricImage.js"
import {FabricCanvas} from "../../FabricWrapper/FabricCanvas.js"
import {KeyValuePair} from "../../Domain.js"

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

  set(options: any) {
    this.underlying.set(options)
    this.width = this.underlying.getScaledWidth()
    this.height = this.underlying.getScaledHeight()
  }

  getPos() {
    return {
      xr: this.underlying.get("left") / this.canvas.width,
      yr: this.underlying.get("top") / this.canvas.height
    }
  }

  async copy() {
    const clonedFabricImage = await new Promise<FabricImage>(resolve => this.underlying.clone(resolve))
    return new RelativeFabricImage(clonedFabricImage, this.canvas)
  }

  async copyN(n: number): Promise<Array<KeyValuePair<number, RelativeFabricImage>>> {
    let copies: Array<KeyValuePair<number, RelativeFabricImage>> = []
    for (let i = 0; i < n; i++) {
      const copy = await this.copy()
      copies.push({key: i, value: copy})
    }
    return copies
  }

  get(parameterName: string): any {
    return this.underlying.get(parameterName)
  }
}