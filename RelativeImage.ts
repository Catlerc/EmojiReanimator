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

export interface FabricCanvas {
    add(image: FabricImage): void

    width: number
    height: number
}

export class RelativeImage {
    fabricImage: FabricImage
    centerOffset: Offset
    canvas?: FabricCanvas
    width: number
    height: number

    constructor(fabricImage: FabricImage) {
        this.fabricImage = fabricImage
    }


    rescaleToFit(width: number, height: number): void {
        const scale = Math.min(width / this.fabricImage.width, height / this.fabricImage.height)
        this.fabricImage = this.fabricImage.scale(scale)

        this.centerOffset = {
            x: this.fabricImage.getScaledWidth() / 2,
            y: this.fabricImage.getScaledHeight() / 2
        }
        this.width = this.fabricImage.getScaledWidth() / this.canvas.width
        this.height = this.fabricImage.getScaledHeight() / this.canvas.height
    }

    attach(canvas: FabricCanvas) {
        canvas.add(this.fabricImage)
        this.canvas = canvas
    }

    setPos(xn: number, yn: number) {
        this.fabricImage.set({
            left: this.canvas.width * xn - this.centerOffset.x,
            top: this.canvas.height * yn - this.centerOffset.y
        })
    }

    getPos() {
        return {
            xr: this.fabricImage.get('left') / this.canvas.width,
            yr: this.fabricImage.get('top') / this.canvas.height
        }
    }

    async copy() {
        const clonedFabricImage = await new Promise<FabricImage>(resolve => this.fabricImage.clone(resolve))
        const clonedRelativeImage = new RelativeImage(clonedFabricImage)
        clonedRelativeImage.centerOffset = this.centerOffset
        clonedRelativeImage.canvas = this.canvas
        clonedRelativeImage.width = this.width
        clonedRelativeImage.height = this.height
        if (clonedRelativeImage.canvas !== null) clonedRelativeImage.canvas.add(clonedRelativeImage.fabricImage)
        return clonedRelativeImage
    }
}


