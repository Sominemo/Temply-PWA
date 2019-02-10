import WindowManager from "../ui/SimpleWindowManager"
import DOM from "../ui/DOM/Classes/dom"
import Nav from "../ui/DOM/Library/buildBlock/nav"
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
