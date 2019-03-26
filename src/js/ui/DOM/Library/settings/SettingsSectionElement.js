import DOM from "../../Classes/dom"
import Title from "../object/title"

export default class SettingsSectionElement {
    constructor(options, object) {
        return new DOM({
            new: "div",
            class: ["settings-section-chunk"],
            content: [
                ...("name" in options ? [new Title(options.name, 2)] : []),
            ],
        })
    }
}
