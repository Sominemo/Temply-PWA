import DOM from "../../Classes/dom"

export default class Padding {
    constructor(content, padding, style = {}) {
        padding = padding.toString()
        padding = (padding.match(/\d$/) ? `${padding}px` : padding)
        return new DOM({
            new: "div",
            style: {
                ...style,
                padding,
            },
            content,
        })
    }
}
