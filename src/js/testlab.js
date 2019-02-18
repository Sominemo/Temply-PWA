import SettingsLayout from "./services/Settings/user/layout"
import DOM from "./ui/DOM/Classes/dom"

const a = new SettingsLayout()
    .createAct({ id: "settings", dom: DOM })
    .createAct({ id: "logs", dom: DOM })
    .createAct({ id: "updates", dom: DOM })
    .createAct({ id: "debug", dom: DOM })

const b = a.getAct("settings")
    .createSection({ id: "general", dom: DOM })
    .createSection({ id: "other", dom: DOM })

const c = b.getSection("general")
    .createGroup({ id: "general-group", dom: DOM })

c.getGroup("general-group")
    .createItem({ id: "test", dom: DOM })

console.log(a)
