import WindowManager from "../../../ui/SimpleWindowManager"
import Nav from "../../../ui/DOM/Library/buildBlock/nav"
import Navigation from "../../../main/navigation"
import WindowContainer from "../../../ui/DOM/Library/buildBlock/windowContainer"
import SettingsLayout from "./layout"
import Card from "../../../ui/DOM/Library/object/card/card"
import Title from "../../../ui/DOM/Library/object/title"
import CardList from "../../../ui/DOM/Library/object/card/cardList"
import Design from "../../../main/design"

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
    static _layout = false

    static applyLayout(l) {
        if (!(l instanceof SettingsLayout)) throw new TypeError("Only Settings Layout can be applied")

        this._layout = l
    }

    static Init() {
        const w = new WindowContainer()
        WindowManager.newWindow().append(w)

        try {
            if (!(this._layout instanceof SettingsLayout)) {
                throw new TypeError(`Incorrect Settings Layout applied of type ${typeof this._layout}`)
            }

            const l = this._layout
            w.render(l.getAct(l.defaultAct).render())
        } catch (e) {
            w.clear()
            w.render(new Title("Oops!"))
            w.render(new Card(new CardList([
                {
                    content: "Looks like we failed to load settings layout.",
                },

                {
                    content: "Open About screen",
                    handler() { Navigation.hash = { module: "about", params: {} } },
                    style: {
                        background: Design.getVar("color-accent"),
                        color: Design.getVar("color-generic-inverted"),
                    },
                },
            ])))

            throw e
        }
        /*

        const aboutScreen = () => {
            Navigation.hash = {
                module: "about",
                params: {},
            }
        }

        w.render(new Title("Settings"))
        w.render(new Title("General", 2))
        w.render(new Card(new CardTextList(
            ["Imaginary section", "Another one", "There's more"],
            { userSelect: false, handler: aboutScreen }
        )))
        w.render(new Title("Miscellaneous", 2))
        w.render(new Card(new CardTextList(
            ["Imaginary section", "Another one", "There's more"],
            { userSelect: false, handler: aboutScreen }
        )))
        w.render(new Card(new CardTextList(
            ["Imaginary section", "Another one", "There's more"],
            { userSelect: false, handler: aboutScreen }
        )))
        */
    }
}
