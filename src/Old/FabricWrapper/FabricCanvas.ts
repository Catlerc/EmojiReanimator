import {FabricImage} from "./FabricImage.js"

export interface FabricCanvas {
  add(image: FabricImage): void

  getObjects(): Array<any>

  renderAll(): void

  clear(): void

  setBackgroundColor(color: string, _: any): void

  width: number
  height: number
  toCanvasElement(): HTMLCanvasElement
}