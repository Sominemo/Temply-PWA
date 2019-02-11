import DOM from "../../../Classes/dom"
import CardContent from "./cardContent"

export default class Card {
    constructor(content = []) {
        return new DOM({
            new: "div",
            class: ["card"],
            content: (typeof content === "string" ? new CardContent(content) : content),
        })
    }
}
