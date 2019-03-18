import updatePopup from "../services/Settings/layouts/updatePopup"
import { Title } from "../ui/DOM/Library/object"
import WindowManager from "../ui/SimpleWindowManager"
import { WindowContainer } from "../ui/DOM/Library/buildBlock"
import Popup from "../ui/DOM/Library/elements/popup"
import { Algin, Padding } from "../ui/DOM/Library/style"
import { $$ } from "../services/Language/handler"
import RadioLabel from "../ui/DOM/Library/object/input/radioLabel"
import { Card } from "../ui/DOM/Library/object/card"
import SettingsStorage from "../services/Settings/SettingsStorage"
import App from "./app"
import DOM from "../ui/DOM/Classes/dom"
import FadeIn from "../ui/Animation/Library/Effects/fadeIn"
import { Button } from "../ui/DOM/Library/object/input"
import FlyIn from "../ui/Animation/Library/Effects/flyIn"
import FlyOut from "../ui/Animation/Library/Effects/flyOut"
import EaseOutQuad from "../ui/Animation/Library/Timing/easeOutQuad"
import { ToastElement } from "../ui/DOM/Library/elements"
import Toast from "../ui/DOM/Library/elements/toast"

export default class TestField {
    static async Init() {
        const testEnabled = !!await SettingsStorage.getFlag("test_field_enabled")
        if (!testEnabled) throw new Error("Test Field is disabled")

        const w = new WindowContainer()
        WindowManager.newWindow().append(w)

        const animational = new DOM({
            new: "div",
            onRender: (p, e) => {
                new FadeIn().apply(e)
            },
            content: new Title("Test Field"),
        })

        w.render(animational)

        let animDirection = "bottom"
        let state = true

        w.render(new Card([
            ...new RadioLabel([
                { handler: (s) => { if (s) animDirection = "bottom" }, selected: true, content: "Bottom" },
                { handler: (s) => { if (s) animDirection = "top" }, content: "Top" },
                { handler: (s) => { if (s) animDirection = "right" }, content: "Right" },
                { handler: (s) => { if (s) animDirection = "left" }, content: "Left" },
            ]),
            new Algin(new Button({
                content: "Animate title",
                handler() {
                    console.log(animDirection)
                    if (state) {
                        new FlyOut({ direction: animDirection, timing: EaseOutQuad })
                            .apply(animational)
                    } else {
                        new FlyIn({ direction: animDirection, timing: EaseOutQuad })
                            .apply(animational)
                    }
                    state = !state
                },
            }), ["center", "row"]),
        ]))


        Toast.add(new Padding("New update", 15), 5000, {
            buttons: [
                {
                    async handler() {
                        const o = WindowManager.newOverlay()
                        o.append(new Popup([
                            new Algin(new Title($$("@settings/updates/ready"), 2), ["center", "row"]),
                            ...await updatePopup(
                                {
                                    update: true,
                                    online: await App.lastChangelog(),
                                },
                            ),
                        ], { control: o, fullWidth: true }))
                    },
                    content: "Tell more",
                },
            ],
        })

        Toast.add("Lol", 500)
    }
}
