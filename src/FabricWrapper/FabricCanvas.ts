import {FabricImage} from "./FabricImage.js"
import {FabricGroup} from "./FabricGroup.js"

export interface FabricCanvas {
  add(image: FabricImage | FabricGroup): void

  getObjects(): Array<any>

  renderAll(): void

  clear(): void

  setBackgroundColor(color: string, _: any): void

  width: number
  height: number
  toCanvasElement(): HTMLCanvasElement
}