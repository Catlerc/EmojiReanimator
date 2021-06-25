import {Milliseconds, Seconds, Utils} from "./Domain.js";
import {fabric} from "./Vendor.js";
import {Image} from "./Image/Image.js";

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
    image: Image
    fabricImage: FabricImage
    centerOffset: Offset
    canvas?: FabricCanvas
    width: number
    height: number
    scale: number = 1

    constructor(image: Image) {
        this.image = image
        this.width = image.width
        this.height = image.height
    }

    async getFabricImage(time: Seconds): Promise<RelativeFabricImage> {
        let fabricImage = await createImage(Utils.imageDataToDataUrl(this.image.frameByTime(time).image))
        return new RelativeFabricImage(fabricImage.scale(this.scale), this.canvas, this.centerOffset)
    }

    rescaleToFit(width: number, height: number): void {
        this.scale = Math.min(width / this.image.width, height / this.image.height)


        this.centerOffset = {
            x: this.width * this.scale / 2,
            y: this.height * this.scale / 2
        }
        this.width = this.width * this.scale / this.canvas.width
        this.height = this.height * this.scale / this.canvas.height
    }


    attach(canvas: FabricCanvas) {
        this.canvas = canvas
    }

    copy() {
        // const clonedFabricImage = await new Promise<FabricImage>(resolve => this.fabricImage.clone(resolve))
        const clonedRelativeImage = new RelativeImage(this.image)
        clonedRelativeImage.centerOffset = this.centerOffset
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
    centerOffset: Offset

    constructor(underlying: FabricImage,
                canvas: FabricCanvas,
                centerOffset: Offset) {
        this.underlying = underlying
        this.canvas = canvas
        this.centerOffset = centerOffset
    }

    setPos(xn: number, yn: number) {
        this.underlying.set({
            left: this.canvas.width * xn - this.centerOffset.x,
            top: this.canvas.height * yn - this.centerOffset.y
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
        const clonedRelativeImage = new RelativeFabricImage(clonedFabricImage, this.canvas, this.centerOffset)
        clonedRelativeImage.centerOffset = this.centerOffset
        clonedRelativeImage.canvas = this.canvas
        return clonedRelativeImage
    }
}