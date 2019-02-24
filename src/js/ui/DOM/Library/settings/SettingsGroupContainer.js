import FieldsContainer from "../../../../tools/internal/fieldsContainer"
import FieldChecker from "../../../../tools/internal/fieldChecker"
import DOM from "../../Classes/dom"
import Title from "../object/title"

export default class SettingsGroupContainer {
    constructor(options, object) {
        new FieldsContainer([[], {
            name: new FieldChecker({ type: "string" }),
        }]).set(options)

        return new DOM({
            new: "div",
            class: ["card", "settings-group-chunk"],
            content: [
                ...("name" in options ? [new Title(options.name, 3)] : []),
            ],
        })
    }
}