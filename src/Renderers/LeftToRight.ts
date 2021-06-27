import {Renderer} from "../Domain.js";

export const leftToRight: Renderer = async (canvas, image, time) => {
  const clone = await image.copy()

  image.setPos(time + 0.5, 0.5)
  clone.setPos((time - 1) + 0.5, 0.5)

  canvas.add(image.underlying)
  canvas.add(clone.underlying)
}