import { ReferenceModule } from "./Modules/Reference/ReferenceModule.js";
import { TabsModule } from "./Modules/Tabs/TabsModule.js";
import { ReanimatorModule } from "./Modules/Reanimator/ReanimatorModule.js";
var reference = new ReferenceModule();
reference.link();
reference.load();
var d = new TabsModule([new ReanimatorModule(), new ReferenceModule()]);
d.link();
d.load();
//# sourceMappingURL=Main.js.map