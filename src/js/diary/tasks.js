import WindowManager from "../ui/SimpleWindowManager"
import DOM from "../ui/dom/dom"
import Nav from "../ui/dom/domLibrary/buildBlock/nav"
import Navigation from "../main/navigation"

Nav.newItem({
    name: "Tasks",
    icon: "assignment",
    id: "tasks",
    handler: () => {
        Navigation.hash = {
            module: "tasks",
            params: {},
        }
    },
})

export default class Tasks {
    static Init() {
        const win = WindowManager.newWindow()

        win.append(new DOM({
            new: "div",
            content: "Tasks",
        }))
    }
}
