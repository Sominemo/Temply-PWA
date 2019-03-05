import Navigation from "../main/navigation"
import WindowContainer from "../ui/DOM/Library/buildBlock/windowContainer"
import { Nav } from "../ui/DOM/Library/buildBlock"
import WindowManager from "../ui/SimpleWindowManager"
import { Card, CardTextList } from "../ui/DOM/Library/object/card"
import { Title } from "../ui/DOM/Library/object"
import { $$ } from "../services/Language/handler"

Nav.newItem({
    name() { return $$("timetable") },
    icon: "schedule",
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
        const w = new WindowContainer()
        WindowManager.newWindow().append(w)

        const days = () => w.render(new Card(new CardTextList(
            [
                $$("@dateformats/week/days/su"),
                $$("@dateformats/week/days/mo"),
                $$("@dateformats/week/days/tu"),
                $$("@dateformats/week/days/we"),
                $$("@dateformats/week/days/th"),
                $$("@dateformats/week/days/fr"),
                $$("@dateformats/week/days/sa"),
            ],
        )))

        w.render(new Title($$("timetable")))

        w.render(new Title($$("@dateformats/relative/today"), 2))
        days()
        w.render(new Title($$("@dateformats/relative/tomorrow"), 2))
        days()
    }
}
