import DOM from "../../Classes/dom"

export default class AlignedContent {
    constructor(a) {
        return new DOM({
            new: "div",
            style: {
                display: "flex",
                alignItems: "center",
            },
            content: a.map(item => new DOM({
                new: "div",
                style: {
                    display: "flex",
                    flexDirection: "column",
                },
                content: item,
            })),
        })
    }
}
