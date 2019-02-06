import SettingsCheckProvider from "../services/Settings/SettingsCheckProvider"
import FieldChecker from "../tools/internal/fieldChecker"

SettingsCheckProvider.setRules({
    test: {
        default: "lorem",
        checker: new FieldChecker({ type: "string" }),
        onfail: (a, b, c) => { c(a.toString()); return true },
        onupdate: (...a) => console.log("Test setting updated", ...a),
    },
})
