import {Module} from "./Module.js"
import {ReferenceModule} from "./Modules/Reference/ReferenceModule.js"
import {TabsModule} from "./Modules/Tabs/TabsModule.js"
import {ReanimatorModule} from "./Modules/Reanimator/ReanimatorModule.js"

const reference = new ReferenceModule()
reference.link()
reference.load()


const d = new TabsModule([new ReanimatorModule(),new ReferenceModule()])
d.link()
d.load()
