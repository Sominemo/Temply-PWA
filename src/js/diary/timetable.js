import WindowManager from "../ui/SimpleWindowManager"
import DOM from "../ui/dom/dom"
import Nav from "../ui/dom/domLibrary/buildBlock/nav"
import Navigation from "../main/navigation"

Nav.newItem({
    name: "Timetable",
    icon: "access_time",
    id: "timetable",
    handler: () => {
        Navigation.hash = {
            module: "timetable",
            params: {},
        }
    },
})

export default class Timetable {
    static Init() {
        const win = WindowManager.newWindow()

        win.append(new DOM({
            new: "div",
            content: "Timetable",
        }))
    }
}
