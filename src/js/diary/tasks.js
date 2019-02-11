import WindowManager from "../ui/SimpleWindowManager"
import Nav from "../ui/DOM/Library/buildBlock/nav"
import Navigation from "../main/navigation"
import WindowContainer from "../ui/DOM/Library/buildBlock/windowContainer"
import Title from "../ui/DOM/Library/object/title"
import Card from "../ui/DOM/Library/object/card/card"
import CardTextList from "../ui/DOM/Library/object/card/cardTextList"
import Icon from "../ui/DOM/Library/object/icon"
import Design from "../main/design"

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
        const w = new WindowContainer()
        WindowManager.newWindow().append(w)

        w.render(new Title("Tasks"))

        w.render(
            new Title("Your Agenda", 2,
                {
                    marginLeft: `${30 - parseInt(Design.getVar("size-icon-default"), 10)}px`,
                },
                new Icon("flag", { color: Design.getVar("color-main"), marginRight: "5px" })),
        )
        w.render(new Card(new CardTextList(["Do Temply", "Code Temply", "Work even more on temply"])))


        w.render(
            new Title("Inbox", 2,
                {
                    marginLeft: `${30 - parseInt(Design.getVar("size-icon-default"), 10)}px`,
                },
                new Icon("inbox", { color: Design.getVar("color-accent"), marginRight: "5px" })),
        )
        w.render(new Card(new CardTextList(["Do Temply", "Code Temply", "Work even more on temply"])))
    }
}
