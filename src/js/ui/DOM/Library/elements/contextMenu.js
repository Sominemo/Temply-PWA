import WindowManager from "../../../SimpleWindowManager"
import ContextMenuElement from "./contextMenuElement"
import DOM from "../../Classes/dom"
import { Icon } from "../object"

function toMenuItem(o) {
    const {
        type = "item", icon = null, title, handler = () => { }, disabled = false, unshown = false, style = {},
    } = o

    if (unshown) return false

    if (type === "delimeter") return new DOM({ new: "context-menu-delimeter" })

    if (type === "item") {
        const proxyHandler = () => {
            handler()
            ContextMenuElement.closeAll()
        }

        return new DOM({
            new: "context-menu-item",
            content: new DOM({
                new: "context-menu-item-holder",
                content: [
                    new Icon(icon),
                    new DOM({
                        new: "context-menu-item-title",
                        content: title,
                    }),
                ],
            }),
            style,
            ...(disabled ? { attributes: [{ name: "disabled", value: "" }] } : {}),
            events: [
                {
                    event: "click",
                    handler: proxyHandler,
                },
            ],
        })
    }

    return false
}


export default function ContextMenu({
    content = [], coords = null, style, mode = "context", event = false,
} = {}) {
    const h = WindowManager.newHelper()

    const cm = new ContextMenuElement({
        coords,
        style,
        control: h,
        event,
        mode,
        content: content.reduce((a, c) => {
            const conv = toMenuItem(c)
            if (conv) a.push(conv)
            return a
        }, []),
    })

    h.append(cm)
}
