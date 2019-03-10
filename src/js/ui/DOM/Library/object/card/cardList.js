import DOM from "../../../Classes/dom"
import FieldsContainer from "../../../../../tools/validation/fieldsContainer"
import FieldChecker from "../../../../../tools/validation/fieldChecker"
import CardContent from "./cardContent"

export default class CardList {
    constructor(content, forceWrapper = false) {
        new FieldsContainer([
            "array",
            new FieldsContainer([
                ["content"], {
                    handler: new FieldChecker({ type: "function" }),
                    userSelect: new FieldChecker({ type: "boolean" }),
                    style: new FieldChecker({ type: "object" }),
                },
            ]),
        ]).set(content)

        const elements = []

        content.forEach((e) => {
            const params = { new: "div" }
            params.class = ["card-list-item"]
            if ("content" in e) params.content = (typeof e.content === "string" || forceWrapper ? new CardContent(e.content) : e.content)
            if ("userSelect" in e && !e.userSelect) {
                params.attributes = []
                params.attributes.push({
                    value: "true",
                })
            }
            if ("style" in e) {
                params.style = e.style
            }
            if ("handler" in e) {
                params.class.push("card-list-item-clickable")

                params.events = []
                params.events.push({
                    event: "click",
                    handler: e.handler,
                })
            }

            elements.push(new DOM(params))
        })

        return new DOM({
            new: "div",
            class: ["card-list-container"],
            content: elements,
        })
    }
}
