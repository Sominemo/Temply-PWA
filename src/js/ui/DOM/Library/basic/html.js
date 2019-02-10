import DOM from "../../Classes/dom"

export default class HTML {
    constructor(html) {
        return new DOM({
            html,
        })
    }
}
