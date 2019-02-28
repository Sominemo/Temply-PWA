import Card from "../ui/DOM/Library/object/card/card"
import CardContent from "../ui/DOM/Library/object/card/cardContent"
import WindowManager from "../ui/SimpleWindowManager"
import WindowContainer from "../ui/DOM/Library/buildBlock/windowContainer"
import Title from "../ui/DOM/Library/object/title"
import DOM from "../ui/DOM/Classes/dom"
import SVG from "../ui/DOM/Library/basic/svg"
import Icon from "../ui/DOM/Library/object/icon"
import Design from "./design"
import App from "./app"
import SwitchLabel from "../ui/DOM/Library/object/input/switchLabel"
import SettingsStorage from "../services/Settings/SettingsStorage"
import Button from "../ui/DOM/Library/object/input/button"

export default class FlagsUI {
    static async Init() {
        const w = new WindowContainer()
        WindowManager.newWindow().append(w)
        w.render(new Title("Experiments"))
        w.render(new Card([
            new Title("Warning", 3, {}, new Icon("warning",
                {
                    marginRight: ".2em",
                    fontSize: "1.5em",
                    color: Design.getVar("color-attention"),
                })),
            new CardContent(
                `This features are experimental and some of them may cause problems, make the app unstable or break it at all.
            It's recommended to restart the application after commiting any changes.`,
            ),
            new CardContent([
                new Button({ content: "Reload page", handler: () => { window.location.reload() } }),
                new Button({ content: "Reset flags", handler: () => { SettingsStorage.reset("flags"); window.location.reload() }, type: ["light"] }),
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

        w.render(new Title("List", 2))
        exps.forEach(async (e) => {
            const re = await this.renderSwitch(e.title, e.about, e.id)
            return w.render(re)
        })

        if (exps.length === 0) this.EmptyExperiments(w)
    }

    static async EmptyExperiments(w) {
        w.render(new DOM({
            new: "div",
            style: {
                padding: "20px 0",
            },
            content: [
                new SVG(await import("../../res/images/placeholders/experiments.svg"), {
                    width: "30vmin",
                    margin: "auto",
                    display: "block",
                }),
                new DOM({
                    new: "div",
                    style: {
                        textAlign: "center",
                        marginTop: "20px",
                        fontFamily: "\"Product Sans\"",
                        fontSize: "20px",
                    },
                    content: "There's no experiments for you right now",
                }),
            ],
        }))
    }

    static async renderSwitch(title, about, id) {
        const r = await SettingsStorage.getFlag(id)
        return new Card([
            new SwitchLabel(
                [r, (n) => {
                    const s = {}
                    s[id] = n
                    SettingsStorage.setFlags(s)
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
