import SettingsCheckProvider from "../services/Settings/SettingsCheckProvider"
import FieldChecker from "../tools/validation/fieldChecker"
import App from "../main/app"
import Report from "../main/report"

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
], "flags")
