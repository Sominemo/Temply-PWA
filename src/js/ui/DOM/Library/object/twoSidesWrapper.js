import DOM from "../../Classes/dom"

export default class TwoSidesWrapper {
    constructor(...a) {
        return new DOM({
            new: "div",
            class: ["two-sides-content-wrapper"],
            content: a.map(e => (e instanceof DOM ? e : new DOM({ new: "div", content: e }))),
        })
    }
}
