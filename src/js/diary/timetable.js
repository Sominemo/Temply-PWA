import WindowManager from "../ui/SimpleWindowManager"
import DOM from "../ui/DOM/Classes/dom"
import Nav from "../ui/DOM/Library/buildBlock/nav"
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
