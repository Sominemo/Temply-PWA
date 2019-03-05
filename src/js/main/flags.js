import WindowManager from "../ui/SimpleWindowManager"
import WindowContainer from "../ui/DOM/Library/buildBlock/windowContainer"
import DOM from "../ui/DOM/Classes/dom"
import Design from "./design"
import App from "./app"
import SettingsStorage from "../services/Settings/SettingsStorage"
import { Card, CardContent } from "../ui/DOM/Library/object/card"
import { Title, Icon } from "../ui/DOM/Library/object"
import { Button, SwitchLabel } from "../ui/DOM/Library/object/input"
import { SVG } from "../ui/DOM/Library/basic"
import { $$ } from "../services/Language/handler"

export default class FlagsUI {
    static async Init() {
        const w = new WindowContainer()
        WindowManager.newWindow().append(w)
        w.render(new Title($$("expiriments")))
        w.render(new Card([
            new Title($$("@expiriments/warning"), 3, {}, new Icon("warning",
                {
                    marginRight: ".2em",
                    fontSize: "1.5em",
                    color: Design.getVar("color-attention"),
                })),
            new CardContent($$("@expiriments/harmful_actions")),
            new CardContent([
                new Button({
                    content: $$("@expiriments/reload_page"),
                    handler() {
                        window.location.reload()
                    },
                }),
                new Button({
                    content: $$("@expiriments/reset_flags"),
                    type: ["light"],
                    handler() {
                        SettingsStorage.reset("flags")
                        window.location.reload()
                    },
                }),
            ]),
        ]))
        const exps = []

        if (App.debug) {
            exps.push({
                title: "Displaying 'Experiments' section in settings menu",
                about: "Enables 'Miscellaneous' group and a link to 'Experiments' section for main settings menu",
                id: "miscellaneous_in_settings",
            })
            exps.push({
                title: "TAB-powered navigation",
                about: `Adds tabIndex attributes to all clickable elements so they can be 
                focused by pressing the 'TAB' button and adds event listener for the 'Enter' key to simulate 
                click event for current active element`,
                id: "enable_tab_navigation",
            })
        }

        if ("ontouchend" in document && "webkitRequestFullscreen" in document.documentElement) {
            exps.push({
                title: "Use full-screen experience",
                about: `Sends user to full screen mode on touch if "webkitRequestFullscreen" option
                is supported`,
                id: "fullscreen_on_tap",
            })
        }

        w.render(new Title($$("@expiriments/list"), 2))
        exps.forEach(async (e) => {
            const re = await this.renderSwitch(e.title, e.about, e.id)
            return w.render(re)
        })

        if (exps.length === 0) this.EmptyExperiments(w)
    }

    static async EmptyExperiments(w) {
        const pic = require("Resources/images/placeholders/experiments.svg")
        w.render(new DOM({
            new: "div",
            style: {
                padding: "20px 0",
            },
            content: [
                new SVG(pic, {
                    width: "30vmin",
                    margin: "auto",
                    display: "block",
                }),
                new DOM({
                    new: "div",
                    style: {
                        textAlign: "center",
                        marginTop: "20px",
                        fontFamily: Design.getVar("font-accent"),
                        fontSize: "20px",
                    },
                    content: $$("@expiriments/no_exps_placeholder"),
                }),
            ],
        }))
    }

    static async renderSwitch(title, about, id) {
        const r = await SettingsStorage.getFlag(id)
        return new Card([
            new SwitchLabel(
                [r, (n) => {
                    SettingsStorage.setFlag(id, n)
                }],
                new DOM({
                    new: "div",
                    content: [
                        new DOM({ new: "div", content: title, style: { fontWeight: "500", fontSize: "20px" } }),
                        new DOM({ new: "div", content: id, style: { color: "lightgrey", fontSize: "12px" } }),
                    ],
                    id: `flag-id-${id}`,
                }),
            ),
            new CardContent(about),
        ])
    }
}
