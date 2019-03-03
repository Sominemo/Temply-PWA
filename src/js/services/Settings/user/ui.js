import WindowManager from "../../../ui/SimpleWindowManager"
import Nav from "../../../ui/DOM/Library/buildBlock/nav"
import Navigation from "../../../main/navigation"
import WindowContainer from "../../../ui/DOM/Library/buildBlock/windowContainer"
import SettingsLayout from "./layout"
import Card from "../../../ui/DOM/Library/object/card/card"
import Title from "../../../ui/DOM/Library/object/title"
import CardList from "../../../ui/DOM/Library/object/card/cardList"
import Design from "../../../main/design"
import SettingsLayoutManager from "./manager"

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
    static async Init() {
        const w = new WindowContainer()
        WindowManager.newWindow().append(w)
        const l = SettingsLayoutManager.layout

        try {
            if (!(l instanceof SettingsLayout)) {
                throw new TypeError(`Incorrect Settings Layout applied of type ${typeof this._layout}`)
            }

            const path = Navigation.parse().params
            const tAct = (path.length > 0 ? path[0] : l.defaultAct)
            const actObj = l.getAct(tAct)

            if (!(typeof actObj === "object")) {
                w.clear()
                w.render(new Title("Oops!"))
                w.render(new Card(new CardList([
                    {
                        content: "There's no such settings page",
                    },

                    {
                        content: "Go to main",
                        handler() { Navigation.hash = { module: "settings" } },
                        style: {
                            background: Design.getVar("color-accent"),
                            color: Design.getVar("color-generic-inverted"),
                        },
                    },
                ])))
                return
            }

            w.render(await actObj.render())
        } catch (e) {
            w.clear()
            w.render(new Title("Oops!"))
            w.render(new Card(new CardList([
                {
                    content: "Looks like we failed to load settings layout.",
                },

                {
                    content: "Open About screen",
                    handler() { Navigation.hash = { module: "about" } },
                    style: {
                        background: Design.getVar("color-accent"),
                        color: Design.getVar("color-generic-inverted"),
                    },
                },
            ])))

            throw e
        }
    }
}
