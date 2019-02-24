import SettingsLayout from "./services/Settings/user/layout"
import SettingsActContainer from "./ui/DOM/Library/settings/SettingsActContainer"
import SettingsUI from "./services/Settings/user/ui"
import SettingsSectionElement from "./ui/DOM/Library/settings/SettingsSectionElement"
import SettingsGroupContainer from "./ui/DOM/Library/settings/SettingsGroupContainer"
import CardContent from "./ui/DOM/Library/object/card/cardContent"

const a = new SettingsLayout()
    .createAct({
 id: "settings", lock: () => true, dom: SettingsActContainer, options: { name: "All Settings" } 
})

a.getAct("settings")
    .createSection({ id: "general", dom: SettingsSectionElement, options: { name: "General" } })
    .getSection("general")
    .createGroup({ id: "newone", dom: SettingsGroupContainer, options: { name: "Test Name" } })
    .getGroup("newone")
    .createItem({ dom: CardContent, options: ["Hello, just a test label!"], id: "justtest" })

SettingsUI.applyLayout(a)

console.log(a)
