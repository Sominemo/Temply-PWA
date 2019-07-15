import Navigation from "@Core/Services/navigation"

import Timetable from "@App/modules/diary/timetable"
import Tasks from "@App/modules/diary/tasks"
import FlagsUI from "@App/modules/main/flags"
import TestField from "@App/modules/main/testField"
import TemplyApp from "@App/modules/main/TemplyApp"
import SettingsUI from "@App/modules/main/settings"
import { CoreLoader } from "@Core/Init/CoreLoader"

CoreLoader.registerTask({
    id: "nav-instances",
    presence: "Set navigation handlers",
    task() {
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
            callback() { TemplyApp.InitAboutScreen() },
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
    },
})
