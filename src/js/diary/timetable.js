import Navigation from "../main/navigation"
import WindowContainer from "../ui/DOM/Library/buildBlock/windowContainer"
import { Nav } from "../ui/DOM/Library/buildBlock"
import WindowManager from "../ui/SimpleWindowManager"
import { Card, CardTextList } from "../ui/DOM/Library/object/card"
import { Title } from "../ui/DOM/Library/object"

Nav.newItem({
    name: "Timetable",
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

        const days = () => w.render(new Card(new CardTextList(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"])))

        w.render(new Title("Timetable"))

        w.render(new Title("Today", 2))
        days()
        w.render(new Title("Tomorrow", 2))
        days()
    }
}
