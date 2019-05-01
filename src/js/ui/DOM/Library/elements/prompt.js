import WindowManager from "../../../SimpleWindowManager"
import Popup from "./popup"
import DOM from "../../Classes/dom"
import { Title } from "../object"
import { CardContent } from "../object/card"
import { Align } from "../style"
import { Button } from "../object/input"

export default function Prompt({
    title = "",
    text = "",
    buttons = [],
    popupSettings = {},
}) {
    const o = WindowManager.newOverlay()
    const ca = []
    let pop

    ca.push(new Title(title, 2))
    ca.push(new CardContent(text))
    ca.push(new DOM({
        new: "div",
        class: "bottom-buttons",
        content: new Align(buttons.map((e) => {
            if (e instanceof DOM) return e
            if (typeof e === "object") if (e.handler === "close") e.handler = () => pop.close()
            return new Button(e)
        }), ["center", "row"]),
    }))

    const content = new DOM({ new: "div", content: ca })
    pop = new Popup(content, { control: o, fullWidth: true, ...popupSettings })
    o.append(pop)
    return pop
}
