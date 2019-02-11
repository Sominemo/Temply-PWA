import DOM from "../../Classes/dom"

export default class WindowContainer {
    constructor(content = []) {
        return new DOM({
            new: "div",
            class: ["win-ct-wrapper"],
            content,
        })
    }
}
