import DOM from "../../Classes/dom"
import Title from "../object/title"
import FieldsContainer from "../../../../tools/validation/fieldsContainer"
import FieldChecker from "../../../../tools/validation/fieldChecker"

export default class SettingsSectionElement {
    constructor(options, object) {
        new FieldsContainer([[], {
            name: new FieldChecker({ type: "string" }),
        }]).set(options)

        return new DOM({
            new: "div",
            class: ["settings-section-chunk"],
            content: [
                ...("name" in options ? [new Title(options.name, 2)] : []),
            ],
        })
    }
}
