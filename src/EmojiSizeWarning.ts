import {Option} from "./Utils/Option.js"

export class EmojiSizeWarning {
  readonly element: HTMLElement
  rootElement: Option<HTMLElement> = Option.none()

  constructor() {
    this.element = document.createElement("div")
    this.element.className = "SizeFailureSign"
    this.hide()
  }

  updateRoot(rootElement: HTMLElement) {
    this.rootElement.forEach(root => root.removeChild(this.element))
    this.rootElement = Option.some(rootElement)
    rootElement.prepend(this.element)
  }

  updatePosition(nearElement: HTMLElement) {
    const rect = nearElement.getBoundingClientRect()
    const translateX = rect.x
    const translateY = rect.y
    this.element.style.transform = `translateY(${translateY}px)`
    this.element.style.transform += `translateX(${translateX}px)`
    this.element.style.display = "block"
  }

  hide() {
    this.element.style.display = "none"
  }

  setText(msg: string) {
    this.element.innerText = msg
  }
}