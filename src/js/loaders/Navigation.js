import Navigation from "../main/navigation"
import Timetable from "../diary/timetable"
import Tasks from "../diary/tasks"
import SettingsUI from "../services/Settings/user/ui"
import App from "../main/app"

Navigation.addModule({
    name: "Timetable",
    id: "timetable",
    callback() { Timetable.Init() },
})

Navigation.addModule({
    name: "Tasks",
    id: "tasks",
    callback() { Tasks.Init() },
})

Navigation.addModule({
    name: "Settings",
    id: "settings",
    callback() { SettingsUI.Init() },
})

Navigation.addModule({
    name: "About",
    id: "about",
    callback() { App.InitAboutScreen() },
})
