import TwoSidesWrapper from "../twoSidesWrapper"
import Switch from "./switch"
import CardContent from "../card/cardContent"
import DOM from "../../../Classes/dom"

export default class SwitchLabel {
    constructor([a, b, c], label) {
        b = b || (() => { })
        c = { include: true, ...c }
        const s = new Switch(a, b, c)
        const msc = new CardContent(
            new TwoSidesWrapper(label, s[0]),
        )
        return new DOM({
            new: "div",
            class: ["card-list-item", "card-list-item-clickable"],
            content: msc,
            events: [
                {
                    event: "click",
                    handler: () => s[1](),
                },
            ],
        })
    }
}
