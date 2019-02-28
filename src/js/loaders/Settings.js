import SettingsCheckProvider from "../services/Settings/SettingsCheckProvider"
import FieldChecker from "../tools/validation/fieldChecker"

SettingsCheckProvider.setRules([
    {
        name: "test",
        rule: {
            default: "lorem",
            checker: new FieldChecker({ type: "string" }),
            onfail: async (a, b, c) => { await c(a.toString()); return true },
            onupdate: (...a) => console.log("Test setting updated", ...a),
        },
    },
])

SettingsCheckProvider.setRules([
    {
        name: "enable_tab_navigation",
        rule: {
            default: true,
            checker: new FieldChecker({ type: "boolean" }),
            onfail: async (a, b, c) => { await c(!!a); return true },
        },
    },
], "flags")
