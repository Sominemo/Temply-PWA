import DOM from "../../../Classes/dom"

export default class CardContent {
    constructor(content, style = {}) {
        return new DOM({
            new: "div",
            class: ["card-padding-content"],
            content,
            style,
        })
    }
}
