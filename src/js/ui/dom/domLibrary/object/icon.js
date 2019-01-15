import DOM from "../../dom"

export default class Icon {
    constructor(name) {
        return new DOM({
            new: "icon",
            content: new DOM({
                type: "t",
                new: name.toString(),
            }),
        })
    }
}
