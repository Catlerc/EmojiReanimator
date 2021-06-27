import {fabric} from "../Vendor.js";
import {DataUrl} from "../Domain.js";

export class Utils {
  static arrayBufferToUrl(imageBuffer: ArrayBuffer, type: String) {
    const blob = new Blob([imageBuffer], {type: "image/" + type.toString()});
    const urlCreator = window.URL || window.webkitURL;
    return urlCreator.createObjectURL(blob);
  }

  static createCanvas(width: number, height: number) {
    const renderer = document.createElement('canvas')
    renderer.width = width
    renderer.height = height


    return new fabric.Canvas(renderer)
  }

  static imageDataToDataUrl(imageData: ImageData): DataUrl {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx.putImageData(imageData, 0, 0);

    return canvas.toDataURL();
  }

  static imageBlobToDataUrl(imageBlob: Blob): DataUrl {
    const urlCreator = window.URL || window.webkitURL
    return urlCreator.createObjectURL(imageBlob)
  }
}