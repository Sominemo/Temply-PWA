import DOM from "../../Classes/dom"

export default class Title {
    constructor(content, level = 1) {
        return new DOM({
            new: "div",
            class: ["inline-title-block", `inline-title-level-${parseInt(level.toString(), 10)}`],
            content: content.toString(),
        })
    }
}
