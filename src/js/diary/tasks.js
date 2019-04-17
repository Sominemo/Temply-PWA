import Navigation from "../main/navigation"
import WindowContainer from "../ui/DOM/Library/buildBlock/windowContainer"
import Design from "../main/design"
import { Nav } from "../ui/DOM/Library/buildBlock"
import WindowManager from "../ui/SimpleWindowManager"
import { Title, Icon } from "../ui/DOM/Library/object"
import { Card, CardTextList } from "../ui/DOM/Library/object/card"
import { $$ } from "../services/Language/handler"
import TimeManagementStorage from "./storage/TimeManagementStorage"

Nav.newItem({
    name() { return $$("tasks") },
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
        const w = new WindowContainer()
        WindowManager.newWindow().append(w)
        console.log(TimeManagementStorage)

        w.render(new Title($$("tasks")))

        w.render(
            new Title($$("@tasks/agenda"), 2,
                {
                    marginLeft: `${30 - parseInt(Design.getVar("size-icon-default"), 10)}px`,
                },
                new Icon("flag", { color: Design.getVar("color-main"), marginRight: "5px" })),
        )
        w.render(new Card(new CardTextList(["Do Temply", "Code Temply", "Work even more on temply"])))


        w.render(
            new Title($$("@tasks/inbox"), 2,
                {
                    marginLeft: `${30 - parseInt(Design.getVar("size-icon-default"), 10)}px`,
                },
                new Icon("inbox", { color: Design.getVar("color-accent"), marginRight: "5px" })),
        )
        w.render(new Card(new CardTextList(["Do Temply", "Code Temply", "Work even more on temply"])))
    }
}
