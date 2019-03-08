import DOM from "../../Classes/dom"

export default class Width {
    constructor(content, width, style = {}) {
        width = width.toString()
        width = (width.match(/\d$/) ? `${width}px` : width)
        return new DOM({
            new: "div",
            content,
            style: {
                ...style,
                width,
            },
        })
    }
}
