import {fabric} from "../Vendor.js"
import {DataUrl} from "../Domain.js"
import {FabricCanvas} from "../FabricWrapper/FabricCanvas.js"
import {FabricImage} from "../FabricWrapper/FabricImage.js"

export class Utils {
  static arrayBufferToUrl(imageBuffer: ArrayBuffer, type: String): DataUrl {
    const blob = new Blob([imageBuffer], {type: "image/" + type.toString()})
    const urlCreator = window.URL || window.webkitURL
    return urlCreator.createObjectURL(blob)
  }

  static createCanvas(width: number, height: number): FabricCanvas {
    const renderer = document.createElement("canvas")
    renderer.width = width
    renderer.height = height


    return new fabric.Canvas(renderer)
  }

  static imageDataToDataUrl(imageData: ImageData): DataUrl {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    canvas.width = imageData.width
    canvas.height = imageData.height
    ctx.putImageData(imageData, 0, 0)

    return canvas.toDataURL()
  }

  static imageBlobToDataUrl(imageBlob: Blob): DataUrl {
    const urlCreator = window.URL || window.webkitURL
    return urlCreator.createObjectURL(imageBlob)
  }

  static fabricImageFromDataUrl(imageUrl: string): Promise<FabricImage> {
    return new Promise(resolve => fabric.Image.fromURL(imageUrl, resolve))
  }

  static fold<A, B>(array: B[], init: A, reducer: (init: A, elem: B) => A): A {
    let acc = init
    for (const x of array) acc = reducer(acc, x)
    return acc
  }

  static async asyncFold<A, B>(array: B[], init: A, reducer: (init: A, elem: B) => Promise<A>): Promise<A> {
    let acc = init
    for (const x of array) acc = await reducer(acc, x)
    return acc
  }

}
