import DOM from "../../Classes/dom"

export default class Algin {
    constructor(content, type = ["center"], style = {}) {
        return new DOM({
            new: "div",
            content,
            class: ["ready-flex-algin", ...type],
            style,
        })
    }
}
