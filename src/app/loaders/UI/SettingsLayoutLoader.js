import {
    SettingsActContainer, SettingsSectionElement, SettingsGroupContainer, SettingsActLink,
} from "@Environment/Library/DOM/settings"
import { isRecoveryMode } from "@App/debug/recovery"
import WarningConstructor from "@Environment/Library/DOM/object/warnings/WarningConstructor"
import updatePopup from "@App/tools/interaction/updatePopup"
import { CardTextList, CardList, CardContent } from "@Environment/Library/DOM/object/card"
import WarningConstructorButton from "@Environment/Library/DOM/object/warnings/WarningConstructorButton"
import DOM from "@DOMPath/DOM/Classes/dom"
import BigNumberInput from "@Environment/Library/DOM/object/input/contentEditableWidgets/bigNumberInput"
import TimeNumInput from "@Environment/Library/DOM/object/input/contentEditableWidgets/timeNumInput"
import TimeToDigital from "@Core/Tools/transformation/text/TimeToDigital"
import SecondsToTime from "@Core/Tools/transformation/text/SecondsToTime"
import timeToSeconds from "@Core/Tools/transformation/text/timeToSeconds"
import { ContextMenu } from "@Environment/Library/DOM/elements"
import Toast from "@Environment/Library/DOM/elements/toast"
import { ContentEditable } from "@Environment/Library/DOM/object/input"
import LocationChooser from "@App/modules/diary/widgets/locationChooser"
import IconSide from "@Environment/Library/DOM/object/iconSide"
import Prompt from "@Environment/Library/DOM/elements/prompt"
import SlideOut from "@Environment/Library/Animations/slideOut"
import SettingsLayout from "@Core/Services/Settings/user/layout"
import { $$, $ } from "@Core/Services/Language/handler"
import Navigation from "@Core/Services/navigation"
import SettingsStorage from "@Core/Services/Settings/SettingsStorage"
import SW from "@Core/Services/SW"
import Design from "@Core/Services/design"
import SettingsLayoutManager from "@Core/Services/Settings/user/manager"
import TimeManagementStorage from "@App/modules/diary/storage/TimeManagementStorage"
import { CoreLoader } from "@Core/Init/CoreLoader"
import WeekNumber from "@Core/Tools/time/weekNumber"
import generateLanguageList from "../SettingsLayout/LanguageList"
import generateDBSettingsLayout from "../SettingsLayout/DBPresence"
import generateThemesList from "../SettingsLayout/ThemesList"


CoreLoader.registerTask({
    id: "settings-layout",
    presence: "Settings Layout",
    async task() {
        const layout = new SettingsLayout()
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
                id: "appearance",
                dom: SettingsActContainer,
                options: { name: $$("@settings/appearance") },
            })
            .createAct({
                id: "timetable",
                dom: SettingsActContainer,
                options: { name: $$("timetable") },
            })
            .createAct({
                id: "subjects",
                dom: SettingsActContainer,
                options: { name: $$("subjects") },
            })


        layout.getAct("settings")
            .createSection({
                id: "recovery-mode-section",
                display: isRecoveryMode,
                dom: SettingsSectionElement,
                options: {},
            })
            .createSection({ id: "general", dom: SettingsSectionElement, options: { name: $$("@settings/general") } })
            .createSection({ id: "time-management", dom: SettingsSectionElement, options: { name: $$("@timetable/time_management_settings") } })
            .getSection("general")
            .createGroup({ id: "main-group", dom: SettingsGroupContainer, options: {} })
            .getGroup("main-group")
            .createItem({ dom: SettingsActLink, options: [() => { Navigation.url = { module: "about" } }, $$("@about/app")], id: "about-screen-link" })
            .createItem({
                dom: SettingsActLink, options: ["updates", $$("@settings/updates")], id: "updates-link", display: () => !(/Edge/.test(navigator.userAgent)),
            })
            .createItem({ dom: SettingsActLink, options: ["storage", $$("@settings/storage")], id: "storage-link" })
            .createItem({ dom: SettingsActLink, options: ["language", $$("@settings/language")], id: "language-link" })
            .createItem({ dom: SettingsActLink, options: ["appearance", $$("@settings/appearance")], id: "appearance-link" })

        layout.getAct("settings").getSection("time-management")
            .createGroup({ id: "time-management-group", dom: SettingsGroupContainer, options: {} })
            .getGroup("time-management-group")
            .createItem({ dom: SettingsActLink, options: ["timetable", $$("timetable")], id: "timetable-link" })
            .createItem({ dom: SettingsActLink, options: ["subjects", $$("subjects")], id: "subjects-link" })

        layout.getAct("settings").getSection("recovery-mode-section")
            .createGroup({
                id: "recovery-mode-alert", dom: SettingsGroupContainer, options: { type: ["warn-highlight"] },
            })
            .getGroup("recovery-mode-alert")
            .createItem({
                id: "recovery-mode-alert-text",
                dom: WarningConstructor,
                options: {
                    type: 3,
                    icon: "warning",
                    title: $$("@recovery_mode/now"),
                    content: $$("@recovery_mode/back_to_normal"),
                },
            })


        layout.getAct("settings")
            .createSection({
                id: "miscellaneous",
                dom: SettingsSectionElement,
                options: { name: $$("@experiments/miscellaneous") },
                display: async () => !!await SettingsStorage.getFlag("miscellaneous_in_settings"),
            })
            .getSection("miscellaneous")
            .createGroup({ id: "experiments-menus", dom: SettingsGroupContainer, options: {} })
            .getGroup("experiments-menus")
            .createItem({ dom: SettingsActLink, options: [() => { Navigation.url = { module: "flags" } }, $$("experiments")], id: "experiments-menu-link" })
            .createItem({
                dom: SettingsActLink,
                options: [() => { Navigation.url = { module: "test" } }, "Test Field"],
                id: "test-field-menu-link",
                display: async () => !!await SettingsStorage.getFlag("test_field_enabled"),
            })

        layout.getAct("updates")
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

        layout.getAct("updates").getSection("updates-main").getGroup("updates-notify-explanations")
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

        layout.getAct("updates").getSection("updates-main").getGroup("updates-pending-alert")
            .createItem({
                id: "update-pending-text",
                dom: WarningConstructorButton,
                options: {
                    type: 3,
                    icon: "warning",
                    title: $$("@settings/updates/pending"),
                    content: $$("@settings/updates/click_to_restart"),
                    button: {
                        content: $$("@settings/updates/restart"),
                        handler() { window.location.reload() },

                    },
                },
            })

        let lessonLength = await SettingsStorage.get("timetable_lesson_default_length")
        let breakLength = await SettingsStorage.get("timetable_break_default_length")
        let lessonStart = await SettingsStorage.get("timetable_lesson_default_start")
        const weekCount = () => SettingsStorage.get("timetable_weeks_count")
        let startWeek = await SettingsStorage.get("timetable_first_week_number")
        const curWeekNumber = () => TimeManagementStorage.weekOrderNumber()
        let weekNumber

        layout.getAct("timetable")
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
            .createItem({
                id: "timetable-default-schedule-length",
                dom: async () => new BigNumberInput(
                    {
                        units: num => $("@units/week", { number: num }),
                        placeholder: $$("@timetable/schedule_length"),
                        content: await weekCount(),
                        max: 53,
                        min: 1,
                        async onchange(n) {
                            n = parseInt(n, 10)
                            if (n < 1 || n > 53) n = await weekCount()
                            await SettingsStorage.set("timetable_weeks_count", n)
                            weekNumber.changeValue(await TimeManagementStorage.weekOrderNumber())
                        },
                    },
                ),
                options: {
                },
            })
            .createItem({
                id: "timetable-default-week-number",
                dom: async () => {
                    weekNumber = new BigNumberInput(
                        {
                            placeholder: $$("@timetable/week_number"),
                            content: await curWeekNumber(),
                            min: 1,
                            max: () => weekCount(),
                            async onchange(n) {
                                n = parseInt(n, 10)
                                if (n < 1 || n > await weekCount()) n = 1
                                startWeek = WeekNumber()[1] + n - 1
                                await SettingsStorage.set("timetable_first_week_number", startWeek)
                            },
                        },
                    )
                    return weekNumber
                },
                options: {
                },
            })

        layout.getAct("timetable")
            .createSection({
                id: "timetable-hints",
                dom: SettingsSectionElement,
                options: {},
            })
            .getSection("timetable-hints")
            .createGroup({
                id: "timetable-hints-group",
                dom: DOM,
                options: {
                    new: "div",
                },
            })
            .getGroup("timetable-hints-group")
            .createItem({
                id: "timetable-io-hint",
                dom: WarningConstructorButton,
                options: {
                    type: 2,
                    icon: "info",
                    title: $$("@timetable/hint"),
                    style: { marginTop: "15px" },
                    content: $$("@timetable/where_to_control"),
                    button: {
                        content: $$("@timetable/check_out"),
                        handler: () => { Navigation.url = { module: "settings", params: ["storage"] } },
                    },
                },
            })


        layout.getAct("subjects")
            .createSection({
                id: "subjects-list",
                dom: SettingsSectionElement,
                options: { name: $$("@subjects/list") },
            })
            .getSection("subjects-list")
            .createGroup({
                id: "subjects-list-group",
                dom: SettingsGroupContainer,
                options: {},
            })
            .getGroup("subjects-list-group")
            .createItem({
                id: "subjects-list-dom",
                dom: async () => {
                    const list = (await TimeManagementStorage.getAllSubjects()).sort((a, b) => {
                        if (a.name < b.name) { return -1 }
                        if (a.name > b.name) { return 1 }
                        return 0
                    })
                    return new CardList(
                        [
                            ...list.map(sub => ({
                                content: sub.name,
                                handler(ev, el) {
                                    ContextMenu({
                                        event: ev,
                                        content: [
                                            {
                                                icon: "edit",
                                                title: $$("@timetable/edit/edit_item"),
                                                handler() {
                                                    let { name } = sub
                                                    let location = sub.cab
                                                    let p

                                                    async function saver() {
                                                        if (name === "") return

                                                        const s = (await TimeManagementStorage
                                                            .getAllSubjects())
                                                            .filter(e => name === e.name)
                                                        if (s.length > 0 && s[0].key !== sub.key) {
                                                            Toast.add($$("@timetable/edit/subject_exists"))
                                                            return
                                                        }

                                                        sub.cab = location
                                                        sub.name = name
                                                        await TimeManagementStorage.newSubject(sub)
                                                        el.clear(new CardContent(name))
                                                        p.close()
                                                    }

                                                    const locationSignElement = new DOM({ new: "div", content: (location || $$("location")) })

                                                    const edits = new DOM({ new: "div" })

                                                    const nameInput = new ContentEditable({
                                                        placeholder: $$("@subjects/name"),
                                                        change(n) {
                                                            name = String(n).trim().substring(0, 30)
                                                        },
                                                        content: name,
                                                    })

                                                    const locationInput = new SettingsActLink(
                                                        [(evt, elm) => {
                                                            LocationChooser((n) => {
                                                                locationSignElement.clear(n)
                                                                location = n
                                                            })
                                                        }, new IconSide(
                                                            "meeting_room",
                                                            locationSignElement,
                                                            { style: { color: Design.getVar("color-accent"), marginRight: ".5em" } },
                                                        )],
                                                    )

                                                    edits.render(nameInput)
                                                    edits.render(locationInput)

                                                    p = Prompt({
                                                        title: $$("@timetable/edit/edit_item"),
                                                        text: edits,
                                                        buttons: [
                                                            {
                                                                content: $$("@timetable/edit/cancel"),
                                                                handler: "close",
                                                                type: ["light"],
                                                            },
                                                            {
                                                                content: $$("done"),
                                                                handler: saver,
                                                            },
                                                        ],
                                                    })
                                                },
                                            },
                                            {
                                                icon: "delete",
                                                title: $$("@timetable/edit/del_item"),
                                                handler() {
                                                    const p = Prompt({
                                                        title: $$("@timetable/edit/warning"),
                                                        text: $$("@timetable/edit/delete_subject_warning"),
                                                        buttons: [
                                                            {
                                                                content: $$("@timetable/edit/cancel"),
                                                                handler: "close",
                                                                type: ["light"],
                                                            },
                                                            {
                                                                content: $$("@timetable/edit/del_item"),
                                                                async handler() {
                                                                    await TimeManagementStorage
                                                                        .removeSubject(sub.key)
                                                                    Toast.add($$("@timetable/edit/removed"))
                                                                    await new SlideOut({
                                                                        duration: 100,
                                                                    })
                                                                        .apply(el)
                                                                    el.destructSelf()
                                                                    p.close()
                                                                },
                                                            },
                                                        ],
                                                    })
                                                },
                                            },
                                        ],
                                    })
                                },
                            })),
                            ...(list.length === 0
                                ? [
                                    {
                                        content: new WarningConstructor({
                                            content: $$("@timetable/subject_list_empty"),
                                            icon: "explore",
                                        }),
                                    },
                                ]
                                : []),
                        ],
                    )
                },

                options: {},
            })

        layout.getAct("subjects")
            .createSection({
                id: "subjects-hints",
                dom: SettingsSectionElement,
                options: {},
            })
            .getSection("subjects-hints")
            .createGroup({
                id: "subjects-hints-group",
                dom: DOM,
                options: {
                    new: "div",
                },
            })
            .getGroup("subjects-hints-group")
            .createItem({
                id: "subjects-create-hint",
                dom: WarningConstructorButton,
                options: {
                    type: 2,
                    icon: "info",
                    title: $$("@timetable/hint"),
                    content: $$("@timetable/where_to_create_subjects"),
                    style: { marginTop: "15px" },
                    button: {
                        content: $$("@timetable/check_out"),
                        handler: () => { Navigation.url = { module: "timetable", params: ["edit"] } },
                    },
                },
            })

        generateDBSettingsLayout(layout.getAct("storage"))

        generateLanguageList(layout.getAct("language"))
        await generateThemesList(layout.getAct("appearance"))

        SettingsLayoutManager.applyLayout(layout)
    },
})
