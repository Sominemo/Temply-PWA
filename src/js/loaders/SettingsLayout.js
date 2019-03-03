import Navigation from "../main/navigation"
import SettingsStorage from "../services/Settings/SettingsStorage"
import SettingsUI from "../services/Settings/user/ui"
import {
    SettingsActContainer, SettingsSectionElement, SettingsGroupContainer, SettingsActLink,
} from "../ui/DOM/Library/settings"
import { CardList } from "../ui/DOM/Library/object/card"
import SettingsLayout from "../services/Settings/user/layout"

const a = new SettingsLayout()
    .createAct({
        id: "settings", dom: SettingsActContainer, options: { name: "All Settings" },
    })


a.getAct("settings")
    .createSection({ id: "general", dom: SettingsSectionElement, options: { name: "General" } })
    .getSection("general")
    .createGroup({ id: "alpha-information", dom: SettingsGroupContainer, options: { name: "Information" } })
    .getGroup("alpha-information")
    .createItem({ dom: CardList, options: [{ content: "Welcome to alpha-testing of Temply PWA" }], id: "welcome-alpha-text" })
    .createItem({ dom: SettingsActLink, options: [() => { Navigation.hash = { module: "about" } }, "About App"], id: "about-screen-link" })

a.getAct("settings")
    .createSection({
        id: "miscellaneous",
        dom: SettingsSectionElement,
        options: { name: "Miscellaneous" },
        display: async () => !!await SettingsStorage.getFlag("miscellaneous_in_settings"),
    })
    .getSection("miscellaneous")
    .createGroup({ id: "experiments-menus", dom: SettingsGroupContainer, options: {} })
    .getGroup("experiments-menus")
    .createItem({ dom: SettingsActLink, options: [() => { Navigation.hash = { module: "flags" } }, "Experiments"], id: "experiments-menu-link" })

SettingsUI.applyLayout(a)
