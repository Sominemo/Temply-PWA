import Scaffold from "./DOM/Library/buildBlock/scaffold"
import Report from "../main/report"
import Navigation from "../main/navigation"
import DOMObjectWrapper from "./DOM/Helpers/domObjectWrapper"

require("../loaders/DBControllers")
require("../services/Settings/SettingsLayout")

document.body.innerHTML = ""

DOMObjectWrapper(document.body)
    .render(new Scaffold({
        navMenu: [
        ],
    }))

try {
    if (!Navigation.listener("change")) throw new Error("No such listener")
} catch (e) {
    Navigation.defaultScreen()
}

Report.write("UI Scaffold inited")
