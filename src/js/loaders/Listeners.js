import Navigation from "../main/navigation"
import SettingsStorage from "../services/Settings/SettingsStorage"
import WindowManager from "../ui/SimpleWindowManager"
import { Nav } from "../ui/DOM/Library/buildBlock"
import PointerInfo from "../services/PointerInfo"

window.addEventListener("hashchange", () => Navigation.listener())
window.addEventListener("mousemove", e => PointerInfo.moveEventListener(e), true)
window.addEventListener("click", e => PointerInfo.clickEventListener(e), true)
window.addEventListener("contextmenu", e => PointerInfo.contextEventListener(e), true)

SettingsStorage.getFlag("enable_tab_navigation").then((r) => {
    if (!r) return
    document.addEventListener("keypress", (a) => { if (a.code === "Enter") { document.activeElement.click() } })
})

window.addEventListener("resize", () => Nav.updateGestuePosition())

WindowManager.EnableFullScreenExperience()
