export interface FabricImage {
  clipPath: any
  width: number
  height: number
  angle: number

  scale(scale: number): FabricImage

  getScaledWidth(): number

  getScaledHeight(): number

  set(options: Object): void

  get(paramName: string): number

  clone(callback: (image: FabricImage) => void): Promise<FabricImage>
}
