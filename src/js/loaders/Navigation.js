import Navigation from "../main/navigation"
import Timetable from "../diary/timetable"
import Tasks from "../diary/tasks"
import SettingsUI from "../services/Settings/user/ui"
import App from "../main/app"
import FlagsUI from "../main/flags"
import TestField from "../main/testField"

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

Navigation.addModule({
    name: "Flags",
    id: "flags",
    callback() { FlagsUI.Init() },
})

Navigation.addModule({
    name: "Test Field",
    id: "test",
    callback() { TestField.Init() },
})
