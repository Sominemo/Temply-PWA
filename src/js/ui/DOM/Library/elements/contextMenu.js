import WindowManager from "../../../SimpleWindowManager"
import ContextMenuElement from "./contextMenuElement"
import DOM from "../../Classes/dom"
import { Icon } from "../object"

function toMenuItem(o, close = false) {
    const {
        type = "item", icon = null, title, handler = () => { }, disabled = false, unshown = false, style = {},
    } = o

    if (unshown) return false

    if (type === "delimeter") return new DOM({ new: "context-menu-delimeter" })

    if (type === "item") {
        const proxyHandler = () => {
            handler()
            if (close) close()
            else ContextMenuElement.closeAll()
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

    if (type === "element") {
        return new DOM({
            new: "context-menu-element",
            content: title,
            style,
        })
    }

    return false
}


export default function ContextMenu({
    content = [], coords = null, style, mode = "context", event = false, noSelfControl = false,
    onClose = false, classes = [], onRendered = () => {}, onClosing = false, renderClasses = [],
} = {}) {
    const h = WindowManager.newHelper()

    const cm = new ContextMenuElement({
        coords,
        style,
        control: h,
        event,
        mode,
        noSelfControl,
        classes,
        onClose,
        onRendered,
        onClosing,
        renderClasses,
        content: content.reduce((a, c) => {
            const conv = toMenuItem(c, () => { cm[0].emitEvent("contextMenuClose") })
            if (conv) a.push(conv)
            return a
        }, []),
    })

    h.append(cm[1])
    h.append(cm[0])

    return (noSelfControl ? [cm[0], cm[2]] : cm[0])
}
