import Scaffold from "./dom/domLibrary/buildBlock/scaffold"
import Report from "../main/report"
import Navigation from "../main/navigation"
import App from "../main/app"

document.body.innerHTML = ""

document.body.appendChild(new Scaffold({
    navMenu: [
    ],
}).element)

try {
    if (!Navigation.listener("change")) throw new Error("No such listener")
} catch (e) {
    App.InitAboutScreen()
}

Report.write("UI Scaffold inited")
