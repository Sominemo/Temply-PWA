import Navigation from "../../main/navigation"
import SettingsStorage from "./SettingsStorage"
import {
    SettingsActContainer, SettingsSectionElement, SettingsGroupContainer, SettingsActLink,
} from "../../ui/DOM/Library/settings"
import { CardList, CardTextList, CardContent } from "../../ui/DOM/Library/object/card"
import SettingsLayout from "./user/layout"
import SettingsLayoutManager from "./user/manager"
import { $$, generateLanguageList, $ } from "../Language/handler"
import updatePopup from "./layouts/updatePopup"
import SW from "../../main/SW"
import { Icon, Title, TwoSidesMobileFlick } from "../../ui/DOM/Library/object"
import AlignedContent from "../../ui/DOM/Library/object/AlignedContent"
import Design from "../../main/design"
import { Button } from "../../ui/DOM/Library/object/input"
import DBUserPresence from "../DBUserPresence"
import { isRecoveryMode } from "../../recovery"
import BigNumberInput from "../../ui/DOM/Library/object/input/contentEditableWidgets/bigNumberInput"
import TimeNumInput from "../../ui/DOM/Library/object/input/contentEditableWidgets/timeNumInput"
import SecondsToTime from "../../tools/transformation/text/SecondsToTime"
import TimeToDigital from "../../tools/transformation/text/TimeToDigital"
import timeToSeconds from "../../tools/transformation/text/timeToSeconds"

export default async function SettingsLayoutLoader() {
    const a = new SettingsLayout()
        .createAct({
            id: "settings", dom: SettingsActContainer, options: { name: $$("settings") },
        })
        .createAct({
            id: "updates",
            dom: SettingsActContainer,
            options: { name: $$("@settings/updates") },
            display: () => !(/Edge/.test(navigator.userAgent)),
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
        .createAct({
            id: "timetable",
            dom: SettingsActContainer,
            options: { name: $$("timetable") },
        })


    a.getAct("settings")
        .createSection({
            id: "recovery-mode-section",
            display: isRecoveryMode,
            dom: SettingsSectionElement,
            options: {},
        })
        .createSection({ id: "general", dom: SettingsSectionElement, options: { name: $$("@settings/general") } })
        .getSection("general")
        .createGroup({ id: "alpha-information", dom: SettingsGroupContainer, options: { name: $$("@settings/general/information") } })
        .getGroup("alpha-information")
        .createItem({ dom: CardList, options: [{ content: $$("@settings/general/welcome_alpha") }], id: "welcome-alpha-text" })
        .createItem({ dom: SettingsActLink, options: [() => { Navigation.hash = { module: "about" } }, $$("@about/app")], id: "about-screen-link" })
        .createItem({
            dom: SettingsActLink, options: ["updates", $$("@settings/updates")], id: "updates-link", display: () => !(/Edge/.test(navigator.userAgent)),
        })
        .createItem({ dom: SettingsActLink, options: ["storage", $$("@settings/storage")], id: "storage-link" })
        .createItem({ dom: SettingsActLink, options: ["language", $$("@settings/language")], id: "language-link" })
        .createItem({ dom: SettingsActLink, options: ["timetable", $$("timetable")], id: "timetable-link" })

    a.getAct("settings").getSection("recovery-mode-section")
        .createGroup({
            id: "recovery-mode-alert", dom: SettingsGroupContainer, options: { type: ["warn-highlight"] },
        })
        .getGroup("recovery-mode-alert")
        .createItem({
            id: "recovery-mode-alert-text",
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
                            new Title($$("@recovery_mode/now"), 2, { marginLeft: 0, marginTop: 0 }),
                            $$("@recovery_mode/back_to_normal"),
                        ],
                    ]),
                ),
            ],
        })


    a.getAct("settings")
        .createSection({
            id: "miscellaneous",
            dom: SettingsSectionElement,
            options: { name: $$("@experiments/miscellaneous") },
            display: async () => !!await SettingsStorage.getFlag("miscellaneous_in_settings"),
        })
        .getSection("miscellaneous")
        .createGroup({ id: "experiments-menus", dom: SettingsGroupContainer, options: {} })
        .getGroup("experiments-menus")
        .createItem({ dom: SettingsActLink, options: [() => { Navigation.hash = { module: "flags" } }, $$("experiments")], id: "experiments-menu-link" })
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
                `${$$("@settings/updates/first_time_explanation")}`,
            ],
        })
        .createItem({
            id: "updates-notify-info-link",
            dom: SettingsActLink,
            options: [
                () => {
                    window.open($$("@settings/updates/pwa_support_link"), "_blank")
                },
                $$("@settings/updates/learn_more_about_pwa"),
                "open_in_new",
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

    let lessonLength = await SettingsStorage.get("timetable_lesson_default_length")
    let breakLength = await SettingsStorage.get("timetable_break_default_length")
    let lessonStart = await SettingsStorage.get("timetable_lesson_default_start")

    a.getAct("timetable")
        .createSection({
            id: "timetable-defaults",
            dom: SettingsSectionElement,
            options: { name: $$("@timetable/defaults") },
        })
        .getSection("timetable-defaults")
        .createGroup({
            id: "timetable-defaults-group",
            dom: SettingsGroupContainer,
            options: {
                type: ["forced-card-padding"],
            },
        })
        .getGroup("timetable-defaults-group")
        .createItem({
            id: "timetable-default-lesson-length",
            dom: () => new BigNumberInput(
                {
                    units: num => $("@units/min", { number: num }),
                    placeholder: $$("@timetable/lesson_length"),
                    content: lessonLength,
                    max: 1440,
                    async onchange(n) {
                        n = parseInt(n, 10)
                        if (n < 0 || n > 1440) n = lessonLength
                        await SettingsStorage.set("timetable_lesson_default_length", n)
                        lessonLength = await SettingsStorage.get("timetable_lesson_default_length")
                    },
                },
            ),
            options: {
            },
        })
        .createItem({
            id: "timetable-default-break-length",
            dom: () => new BigNumberInput(
                {
                    units: num => $("@units/min", { number: num }),
                    placeholder: $$("@timetable/break_length"),
                    content: breakLength,
                    max: 1440,
                    async onchange(n) {
                        n = parseInt(n, 10)
                        if (n < 0 || n > 1440) n = breakLength
                        await SettingsStorage.set("timetable_break_default_length", n)
                        breakLength = await SettingsStorage.get("timetable_break_default_length")
                    },
                },
            ),
            options: {
            },
        })
        .createItem({
            id: "timetable-default-lesson-start",
            dom: () => new TimeNumInput({
                placeholder: $$("@timetable/lessons_start"),
                content: TimeToDigital(SecondsToTime(lessonStart)),
                async onchange(n) {
                    n = timeToSeconds(n)
                    n = parseInt(n, 10)
                    if (n < 0 || n > 86400) n = lessonStart
                    await SettingsStorage.set("timetable_lesson_default_start", n)
                    lessonStart = await SettingsStorage.get("timetable_lesson_default_start")
                },
            }),
            options: {
            },
        })

    DBUserPresence.generateSettingsLayout(a.getAct("storage"))

    generateLanguageList(a.getAct("language"))

    SettingsLayoutManager.applyLayout(a)
}
