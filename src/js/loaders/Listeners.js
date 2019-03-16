import Navigation from "../main/navigation"
import SettingsStorage from "../services/Settings/SettingsStorage"
import WindowManager from "../ui/SimpleWindowManager"
import { Nav } from "../ui/DOM/Library/buildBlock"

window.addEventListener("hashchange", () => Navigation.listener())

SettingsStorage.getFlag("enable_tab_navigation").then((r) => {
    if (!r) return
    document.addEventListener("keypress", (a) => { if (a.code === "Enter") { document.activeElement.click() } })
})

window.addEventListener("resize", () => Nav.updateGestuePosition())

WindowManager.EnableFullScreenExperience()
