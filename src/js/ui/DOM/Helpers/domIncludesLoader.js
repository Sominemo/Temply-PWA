import DOMController from "./domController"
import SettingsStorage from "../../../services/Settings/SettingsStorage"

export default async function domIncludesLoader() {
    const cache = {}

    function importAll(r) {
        r.keys().forEach((key) => { cache[key] = r(key) })
    }

    importAll(require.context("../Includes/Modificators/", true, /\.js$/))
    importAll(require.context("../Includes/Modules/", true, /\.js$/))
    importAll(require.context("../Includes/Properties/", true, /\.js$/))
    const e = async () => {
        DOMController.setConfig({
            reportRegistration: false,
            reparseAlways: false,
            useFunctionsComparation: false,

            useDefaultNodeTypeOnError: true,
            allowDeprecatedAttributeConstructor: true,

            contentStringAsTextNode: true,

            eventsOnClickAutoTabIndex: !!await SettingsStorage.getFlag("enable_tab_navigation"),
        })
    }

    await e()
}
