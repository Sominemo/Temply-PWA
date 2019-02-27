import SettingsLayout from "./services/Settings/user/layout"
import SettingsActContainer from "./ui/DOM/Library/settings/SettingsActContainer"
import SettingsUI from "./services/Settings/user/ui"
import SettingsSectionElement from "./ui/DOM/Library/settings/SettingsSectionElement"
import SettingsGroupContainer from "./ui/DOM/Library/settings/SettingsGroupContainer"
import CardList from "./ui/DOM/Library/object/card/cardList"
import SettingsActLink from "./ui/DOM/Library/settings/SettingsActLink";

const a = new SettingsLayout()
    .createAct({
        id: "settings", dom: SettingsActContainer, options: { name: "All Settings" },
    })
    .createAct({
        id: "wow", dom: SettingsActContainer, options: { name: "Wow" },
    })


a.getAct("settings")
    .createSection({ id: "general", dom: SettingsSectionElement, options: { name: "General" } })
    .getSection("general")
    .createGroup({ id: "newone", dom: SettingsGroupContainer, options: { name: "Test Name" } })
    .getGroup("newone")
    .createItem({ dom: CardList, options: [{ content: "Hello, just a test label!" }], id: "justtest" })
    .createItem({dom: SettingsActLink, options: []})

SettingsUI.applyLayout(a)

console.log(a)
