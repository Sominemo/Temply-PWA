import Scaffold from "./dom/domLibrary/buildBlock/scaffold"
import Report from "../main/report"
import WindowManager from "./SimpleWindowManager"
import DOM from "./dom/dom"
import App from "../main/app"

document.body.innerHTML = ""

document.body.appendChild(new Scaffold().element)

Report.write("UI Scaffold inited")

WindowManager.newWindow((w) => {
    w.elementView.appendChild(new DOM({
        type: "t",
        new: `Welcome to ${App.fullName}`,
    }).element)
})
