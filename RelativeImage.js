class RelativeImage {
  fabricImage = undefined;
  centerOffset = undefined;
  canvas = undefined
  width = undefined
  height = undefined

  constructor(fabricImage) {
    this.fabricImage = fabricImage;
  }

  rescaleToFit(width, height) {
    const scale = Math.min(width / this.fabricImage.width, height / this.fabricImage.height);
    this.fabricImage = this.fabricImage.scale(scale);

    this.centerOffset = {
      x: this.fabricImage.getScaledWidth() / 2,
      y: this.fabricImage.getScaledHeight() / 2
    }
    this.width = this.fabricImage.getScaledWidth() / this.canvas.width;
    this.heigth = this.fabricImage.getScaledHeight() / this.canvas.heigth;
  }

  attach(canvas) {
    canvas.add(this.fabricImage);
    this.canvas = canvas;
  }

  setPos(xn, yn) {
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
    const clonedFabricImage = await new Promise(resolve => this.fabricImage.clone(resolve))
    const clonedRelativeImage = new RelativeImage(clonedFabricImage);
    clonedRelativeImage.centerOffset = this.centerOffset;
    clonedRelativeImage.canvas = this.canvas;
    clonedRelativeImage.width = this.width;
    clonedRelativeImage.height = this.height;
    if (clonedRelativeImage.canvas !== undefined) clonedRelativeImage.canvas.add(clonedRelativeImage.fabricImage);
    return clonedRelativeImage;
  }
}