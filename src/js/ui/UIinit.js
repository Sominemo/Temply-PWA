import Scaffold from "./DOM/Library/buildBlock/scaffold"
import Report from "../main/report"
import Navigation from "../main/navigation"
import App from "../main/app"
import DOMObjectWrapper from "./DOM/Helpers/domObjectWrapper"

document.body.innerHTML = ""

DOMObjectWrapper(document.body)
    .render(new Scaffold({
        navMenu: [
        ],
    }))

try {
    if (!Navigation.listener("change")) throw new Error("No such listener")
} catch (e) {
    App.InitAboutScreen()
}

Report.write("UI Scaffold inited")
