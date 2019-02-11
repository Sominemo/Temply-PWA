import DOM from "../../Classes/dom"

export default class Icon {
    constructor(name, style = {}) {
        return new DOM({
            new: "md-icon",
            style,
            content: new DOM({
                type: "t",
                new: name.toString(),
            }),
        })
    }
}
