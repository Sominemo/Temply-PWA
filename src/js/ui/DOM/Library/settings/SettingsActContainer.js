import FieldsContainer from "../../../../tools/internal/fieldsContainer"
import FieldChecker from "../../../../tools/internal/fieldChecker"
import DOM from "../../Classes/dom"
import Title from "../object/title"

export default class SettingsActContainer {
    constructor(data, object) {
        new FieldsContainer([
            ["name"],
            {
                name: new FieldChecker({ type: "string" }),
            },
        ]).set(data)

        return new DOM({
            new: "div",
            class: ["settings-act-container"],
            content: [
                new Title(data.name),
            ],
        })
    }
}
