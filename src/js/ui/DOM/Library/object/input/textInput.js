import DOM from "../../../Classes/dom"

export default class TextInput {
    constructor({
        set = {}, style = {}, events = [], params = {},
    }) {
        return new DOM({
            new: "input",
            class: "md-input",
            set,
            style,
            events,
            objectProperty: [
                {
                    name: "currentValue",
                    get() { return this.elementParse.native.value },
                },
                {
                    name: "value",
                    set(v) { this.elementParse.native.value = v },
                },
            ],
            ...params,
        })
    }
}
