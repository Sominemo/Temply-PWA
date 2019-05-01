import DOM from "../../Classes/dom"
import { Icon } from "."

export default class IconSide {
    constructor(icon, content, {
        style = {}, after = false, contentStyle = {}, normalIcon = false, containerStyle = {},
    } = {}) {
        const cnt = [new DOM({
            new: "div",
            class: "near-icon-position-block",
            content,
            style: contentStyle,
        })]

        const iconEl = new Icon(icon, {
            margin: (after ? "0 0 0 0.2em" : "0 0.2em 0 0"),
            ...(normalIcon ? {} : { fontSize: "1.5em" }),
            ...style,
        })
        if (after) {
            cnt.push(iconEl)
        } else {
            cnt.unshift(iconEl)
        }

        return new DOM({
            new: "div",
            class: "flex-container",
            content: cnt,
            style: {
                alignItems: "center",
                ...containerStyle,
            },
        })
    }
}
