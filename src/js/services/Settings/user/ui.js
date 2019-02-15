import WindowManager from "../../../ui/SimpleWindowManager"
import Card from "../../../ui/DOM/Library/object/card/card"
import Nav from "../../../ui/DOM/Library/buildBlock/nav"
import Navigation from "../../../main/navigation"
import WindowContainer from "../../../ui/DOM/Library/buildBlock/windowContainer"
import Title from "../../../ui/DOM/Library/object/title"
import CardTextList from "../../../ui/DOM/Library/object/card/cardTextList"

Nav.newItem({
    name: "Settings",
    icon: "settings",
    id: "settings",
    handler: () => {
        Navigation.hash = {
            module: "settings",
            params: {},
        }
    },
})


export default class SettingsUI {
    static Init() {
        const w = new WindowContainer()
        WindowManager.newWindow().append(w)

        const aboutScreen = () => {
            Navigation.hash = {
                module: "about",
                params: {},
            }
        }

        w.render(new Title("Settings"))
        w.render(new Title("General", 2))
        w.render(new Card(new CardTextList(["Imaginary section", "Another one", "There's more"], { userSelect: false, handler: aboutScreen })))
        w.render(new Title("Miscellaneous", 2))
        w.render(new Card(new CardTextList(["Imaginary section", "Another one", "There's more"], { userSelect: false, handler: aboutScreen })))
        w.render(new Card(new CardTextList(["Imaginary section", "Another one", "There's more"], { userSelect: false, handler: aboutScreen })))
    }
}
