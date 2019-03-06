import Navigation from "../../main/navigation"
import SettingsStorage from "./SettingsStorage"
import {
    SettingsActContainer, SettingsSectionElement, SettingsGroupContainer, SettingsActLink,
} from "../../ui/DOM/Library/settings"
import { CardList } from "../../ui/DOM/Library/object/card"
import SettingsLayout from "./user/layout"
import SettingsLayoutManager from "./user/manager"
import { $$ } from "../Language/handler"

const a = new SettingsLayout()
    .createAct({
        id: "settings", dom: SettingsActContainer, options: { name: $$("settings") },
    })


a.getAct("settings")
    .createSection({ id: "general", dom: SettingsSectionElement, options: { name: $$("@settings/general") } })
    .getSection("general")
    .createGroup({ id: "alpha-information", dom: SettingsGroupContainer, options: { name: $$("@settings/general/information") } })
    .getGroup("alpha-information")
    .createItem({ dom: CardList, options: [{ content: $$("@settings/general/welcome_alpha") }], id: "welcome-alpha-text" })
    .createItem({ dom: SettingsActLink, options: [() => { Navigation.hash = { module: "about" } }, $$("@about/app")], id: "about-screen-link" })

a.getAct("settings")
    .createSection({
        id: "miscellaneous",
        dom: SettingsSectionElement,
        options: { name: $$("@expiriments/miscellaneous") },
        display: async () => !!await SettingsStorage.getFlag("miscellaneous_in_settings"),
    })
    .getSection("miscellaneous")
    .createGroup({ id: "experiments-menus", dom: SettingsGroupContainer, options: {} })
    .getGroup("experiments-menus")
    .createItem({ dom: SettingsActLink, options: [() => { Navigation.hash = { module: "flags" } }, $$("expiriments")], id: "experiments-menu-link" })

SettingsLayoutManager.applyLayout(a)
