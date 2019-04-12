import DOM from "../../Classes/dom"

export default class Icon {
    constructor(name = null, style = {}) {
        return new DOM({
            new: "md-icon",
            style,
            class: ["notranslate"],
            content: (name === null
                ? new DOM({
                    new: "div",
                    content: "....",
                    style: {
                        color: "transparent",
                    },

                })
                : new DOM({
                    type: "t",
                    new: name.toString(),
                })),
        })
    }
}
