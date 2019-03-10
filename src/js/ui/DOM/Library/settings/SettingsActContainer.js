import FieldsContainer from "../../../../tools/validation/fieldsContainer"
import FieldChecker from "../../../../tools/validation/fieldChecker"
import DOM from "../../Classes/dom"
import Title from "../object/title"
import Card from "../object/card/card"

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
                ...(data.lock ? [new Card("Info: You can't commit changes there")] : []),
                // TODO: Make a toast onRender
                new Title(data.name),
            ],
            ...(data.lock ? {
                style: { pointerEvents: "none", opacity: 0.5 },
                attributes: [{ value: true }],
            } : {}),
        })
    }
}
