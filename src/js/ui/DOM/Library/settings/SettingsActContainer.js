import FieldsContainer from "../../../../tools/validation/fieldsContainer"
import FieldChecker from "../../../../tools/validation/fieldChecker"
import DOM from "../../Classes/dom"
import Title from "../object/title"
import Toast from "../elements/toast"
import { $$ } from "../../../../services/Language/handler"

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
                // TODO: Make a toast onRender
                new Title(data.name),
            ],
            ...(data.lock ? {
                style: { pointerEvents: "none", opacity: 0.7 },
            } : {}),
            onRender(p, e) {
                if (data.lock) {
                    Toast.add($$("@settings/locked_item"))
                }
            },
        })
    }
}
