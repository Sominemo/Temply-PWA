import FieldsContainer from "../../../../tools/validation/fieldsContainer"
import DOM from "../../Classes/dom"

export default class Columns {
    constructor(content) {
        new FieldsContainer(["array", new FieldsContainer([
            ["first", "last"], {},
        ])]).set(content)

        const columnItems = []
        content.forEach(((e) => {
            columnItems.push(new DOM({
                new: "div",
                class: "columns-sector",
                content: [
                    new DOM({
                        new: "div",
                        content: e.first,
                    }),
                    new DOM({
                        new: "div",
                        content: e.last,
                    }),
                ],
            }))
        }))

        const cont = new DOM({
            new: "div",
            class: ["columns-container"],
            content: columnItems,
        })

        return cont
    }
}
