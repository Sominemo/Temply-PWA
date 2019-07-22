import SettingsCheckProvider from "@Core/Services/Settings/SettingsCheckProvider"
import FieldChecker from "@Core/Tools/validation/fieldChecker"
import Report from "@Core/Services/report"
import App from "@Core/Services/app"
import { CoreLoader, CoreLoaderResult } from "@Core/Init/CoreLoader"

const timetableDefaults = {
    lesson: 45,
    break: 10,
    start: 28800,
}

CoreLoader.registerTask({
    id: "settings-defaults",
    presence: "Set Setings defaults and checkers",
    task() {
        SettingsCheckProvider.setRules([
            {
                name: "test",
                rule: {
                    default: "lorem",
                    checker: new FieldChecker({ type: "string" }),
                    onfail: async (a, b, c) => { await c(a.toString()); return true },
                    onupdate: (...a) => Report.write("Test setting updated", ...a),
                },
            },
        ])

        SettingsCheckProvider.setRules([
            {
                name: "miscellaneous_in_settings",
                rule: {
                    default: App.debug,
                    checker: new FieldChecker({ type: "boolean" }),
                    onfail: async (a, b, c) => { await c(!!a); return true },
                },
            },
            {
                name: "ui_wm_adv_transitions",
                rule: {
                    default: true,
                    checker: new FieldChecker({ type: "boolean" }),
                    onfail: async (a, b, c) => { await c(!!a); return true },
                },
            },
            {
                name: "ui_wm_adv_css_transitions",
                rule: {
                    default: true,
                    checker: new FieldChecker({ type: "boolean" }),
                    onfail: async (a, b, c) => { await c(!!a); return true },
                },
            },
            {
                name: "ui_wm_no_transitions",
                rule: {
                    default: false,
                    checker: new FieldChecker({ type: "boolean" }),
                    onfail: async (a, b, c) => { await c(!!a); return true },
                },
            },
            {
                name: "tasks_enabled",
                rule: {
                    default: false,
                    checker: new FieldChecker({ type: "boolean" }),
                    onfail: async (a, b, c) => { await c(!!a); return true },
                },
            },
        ], "flags")

        SettingsCheckProvider.setRules([
            {
                name: "timetable_lesson_default_length",
                rule: {
                    default: timetableDefaults.lesson,
                    checker: new FieldChecker({ type: "number", isInt: true, range: [0, 1440] }),
                    async onfail(a, b, c) { await c(timetableDefaults.lesson) },
                },
            },
            {
                name: "timetable_break_default_length",
                rule: {
                    default: timetableDefaults.break,
                    checker: new FieldChecker({ type: "number", isInt: true, range: [0, 1440] }),
                    async onfail(a, b, c) { await c(timetableDefaults.break) },
                },
            },
            {
                name: "timetable_lesson_default_start",
                rule: {
                    default: timetableDefaults.start,
                    checker: new FieldChecker({ type: "number", isInt: true, range: [0, 86400] }),
                    async onfail(a, b, c) { await c(timetableDefaults.start) },
                },
            },
        ], "user")

        return new CoreLoaderResult(true, { SettingsCheckProvider })
    },
})
