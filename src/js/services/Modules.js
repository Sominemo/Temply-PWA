import Navigation from "../main/navigation"
import Timetable from "../diary/timetable"
import Tasks from "../diary/tasks"

Navigation.addModule({
    name: "Timetable",
    id: "timetable",
    callback: Timetable.Init.bind(Timetable),
})

Navigation.addModule({
    name: "Tasks",
    id: "tasks",
    callback: Tasks.Init.bind(Tasks),
})
