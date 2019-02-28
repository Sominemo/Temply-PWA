import DOM from "../../../Classes/dom"

export default class Button {
    constructor({ content, handler, type = "bright" }) {
        type = (Array.isArray(type) ? type : [type])
        return new DOM({
            new: "md-button",
            class: [...type],
            content,
            events: [{
                event: "click",
                handler,
            }],
        })
    }
}
