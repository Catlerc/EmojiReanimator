import {Option} from "./Old/Utils/Option.js"


export abstract class LoadableModule {
  public rootElement: HTMLElement
  public abstract readonly name: string

  abstract onLoad(): void

  constructor() {
    const rootElement = document.createElement('div')
    rootElement.innerText = "Module not loaded"
    this.rootElement = rootElement
  }

  async load() {
    const pathPart = Option
      .fromValue(document.location.pathname.match(/(.+\/)/g))
      .flatMap(matches => Option.fromValue(matches[0]))
      .getOrElse(document.location.pathname)
    const parser = new DOMParser()
    const moduleUrl = document.location.origin + pathPart + "/src/Modules/" + this.name + "/content.html" + document.location.search
    this.rootElement.innerHTML = await fetch(moduleUrl).then(response => response.text())
    const loadedModule = this.rootElement.firstElementChild as HTMLElement
    this.rootElement.replaceWith(loadedModule)
    this.rootElement = loadedModule
    //.parseFromString(string_of_html, 'text/html');

    this.onLoad()
  }

  linkToElement(element: HTMLElement) {
    element.append(this.rootElement)
  }

  replaceWith(id: string) {
    const element = document.getElementById(id)
    element.replaceWith(this.rootElement)
  }

  link() {
    this.replaceWith(this.name.toLowerCase() + "Module")
  }
}

export abstract class Module extends LoadableModule {
}