import DOM from "../../Classes/dom"

export default class Icon {
    constructor(name) {
        return new DOM({
            new: "md-icon",
            content: new DOM({
                type: "t",
                new: name.toString(),
            }),
        })
    }
}
