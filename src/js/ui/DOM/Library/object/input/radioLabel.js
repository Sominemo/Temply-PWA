import FieldsContainer from "../../../../../tools/validation/fieldsContainer"
import FieldChecker from "../../../../../tools/validation/fieldChecker"
import MDRadio from "./md-radio"
import DOM from "../../../Classes/dom"

export default class RadioLabel {
    constructor(data, style = [], bigCard = false) {
        new FieldsContainer(["array",
            new FieldsContainer([
                ["handler", "content"],
                {
                    handler: new FieldChecker({ type: "function" }),
                },
            ])]).set(data)

        const radios = new MDRadio(data.map(e => ({
            handler: e.handler,
            selected: (typeof e.selected === "function" ? !!(e.selected()) : !!e.selected),
            include: true,
        })), style)

        return radios.map((m, i) => new DOM({
            new: "div",
            class: ["card-list-item", "card-list-item-clickable"],
            content: new DOM({
                new: "div",
                class: ["flex-container", "md-radio-label", ...(bigCard ? ["big-card"] : [])],
                content: [
                    m[0],
                    new DOM({
                        new: "div",
                        class: "md-radio-label-content",
                        content: data[i].content,
                    }),
                ],
            }),
            events: [
                {
                    event: "click",
                    handler() { return m[1]() },
                },
            ],
        }))
    }
}
