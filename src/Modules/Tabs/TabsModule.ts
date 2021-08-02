import {Module} from "../../Module.js"
import {Utils} from "../../Old/Utils/Utils.js"

export class TabsModule extends Module {
  readonly name = "Tabs"
  readonly buttons: Map<Module, HTMLButtonElement>


  constructor(private modules: Array<Module>) {
    super()
    this.buttons = Utils.fold(modules, new Map<Module, HTMLButtonElement>(), (map, module) => {
        const button = document.createElement("button")
        button.textContent = module.name
        button.onclick = () => this.select(module)
        return map.set(module, button)
      }
    )
  }

  select(module: Module) {
    this.buttons.forEach(button => button.removeAttribute("disabled"))
    this.buttons.get(module).setAttribute("disabled", "")
    this.modules.forEach(module => module.rootElement.style.display = "none")
    module.rootElement.style.display = "block"
  }

  async onLoad() {
    const tabsLine = document.getElementById("tabsLine")
    this.buttons.forEach(button => tabsLine.append(button))
    const tabsContent = document.getElementById("tabsContent")


    for (const module of this.modules) {
      tabsContent.append(module.rootElement)
      await module.load()
    }

    this.select(this.modules[0])
  }
}