import Navigation from "../../main/navigation"
import SettingsStorage from "./SettingsStorage"
import {
    SettingsActContainer, SettingsSectionElement, SettingsGroupContainer, SettingsActLink,
} from "../../ui/DOM/Library/settings"
import { CardList, CardTextList, CardContent } from "../../ui/DOM/Library/object/card"
import SettingsLayout from "./user/layout"
import SettingsLayoutManager from "./user/manager"
import { $$, generateLanguageList } from "../Language/handler"
import updatePopup from "./layouts/updatePopup"
import SW from "../../main/SW"
import { Icon, Title, TwoSidesMobileFlick } from "../../ui/DOM/Library/object"
import AlignedContent from "../../ui/DOM/Library/object/AlignedContent"
import Design from "../../main/design"
import { Button } from "../../ui/DOM/Library/object/input"
import DBUserPresence from "../DBUserPresence"

const a = new SettingsLayout()
    .createAct({
        id: "settings", dom: SettingsActContainer, options: { name: $$("settings") },
    })
    .createAct({
        id: "updates",
        dom: SettingsActContainer,
        options: { name: $$("@settings/updates") },
    })
    .createAct({
        id: "storage",
        dom: SettingsActContainer,
        options: { name: $$("@settings/storage") },
    })
    .createAct({
        id: "language",
        dom: SettingsActContainer,
        options: { name: $$("@settings/language") },
    })


a.getAct("settings")
    .createSection({ id: "general", dom: SettingsSectionElement, options: { name: $$("@settings/general") } })
    .getSection("general")
    .createGroup({ id: "alpha-information", dom: SettingsGroupContainer, options: { name: $$("@settings/general/information") } })
    .getGroup("alpha-information")
    .createItem({ dom: CardList, options: [{ content: $$("@settings/general/welcome_alpha") }], id: "welcome-alpha-text" })
    .createItem({ dom: SettingsActLink, options: [() => { Navigation.hash = { module: "about" } }, $$("@about/app")], id: "about-screen-link" })
    .createItem({ dom: SettingsActLink, options: ["updates", $$("@settings/updates")], id: "updates-link" })
    .createItem({ dom: SettingsActLink, options: ["storage", $$("@settings/storage")], id: "storage-link" })
    .createItem({ dom: SettingsActLink, options: ["language", $$("@settings/language")], id: "language-link" })

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
    .createItem({
        dom: SettingsActLink,
        options: [() => { Navigation.hash = { module: "test" } }, "Test Field"],
        id: "test-field-menu-link",
        display: async () => !!await SettingsStorage.getFlag("test_field_enabled"),
    })

a.getAct("updates")
    .createSection({
        id: "updates-main",
        dom: SettingsSectionElement,
        options: {},
    })
    .getSection("updates-main")
    .createGroup({
        id: "updates-pending-alert", dom: SettingsGroupContainer, options: { type: ["warn-highlight"] }, display: () => SW.updatePending,
    })
    .createGroup({ id: "updates-notify-explanations", dom: SettingsGroupContainer, options: {} })
    .createGroup({ id: "updates-notify-settings", dom: updatePopup, options: { wait: true } })

a.getAct("updates").getSection("updates-main").getGroup("updates-notify-explanations")
    .createItem({
        id: "updates-notify-explanation",
        dom: CardTextList,
        options: [
            $$("@settings/updates/first_time_explanation_1"),
            $$("@settings/updates/first_time_explanation_2"),
        ],
    })

a.getAct("updates").getSection("updates-main").getGroup("updates-pending-alert")
    .createItem({
        id: "update-pending-text",
        dom: CardContent,
        options: [
            new TwoSidesMobileFlick(
                new AlignedContent([
                    new Icon("warning", {
                        margin: "5px",
                        marginRight: "15px",
                        fontSize: "32px",
                        color: Design.getVar("color-warning-info"),
                    }),
                    [
                        new Title($$("@settings/updates/pending"), 2, { marginLeft: 0, marginTop: 0 }),
                        $$("@settings/updates/click_to_restart"),
                    ],
                ]),
                new Button({
                    content: $$("@settings/updates/restart"),
                    type: ["alert"],
                    handler() {
                        window.location.reload()
                    },
                }),
            ),
        ],
    })

DBUserPresence.generateSettingsLayout(a.getAct("storage"))

generateLanguageList(a.getAct("language"))

SettingsLayoutManager.applyLayout(a)
