import { $$ } from "../../../../../services/Language/handler"
import ContentEditable from "./contentEditable"
import { ContextMenu } from "../../elements"
import DOM from "../../../Classes/dom"
import Icon from "../icon"

export default class WidgetEditable {
    constructor({
        placeholder = $$("tap_to_change"),
        contextParams = {},
        builder = () => { },
        defaults = "",
        iconName = "edit",
        disableResizeHide = false,
        style = {},
        contentStyle = {},
        placeholderStyle = {},
    }) {
        const methods = {}

        const input = new ContentEditable({
            placeholder,
            editable: false,
            methods,
            content: defaults,
            style,
            contentStyle,
            placeholderStyle,
        })

        return new DOM({
            new: "md-widget-editable",
            content: [
                input,
                ...(iconName !== null ? [new DOM({
                    new: "div",
                    class: "md-select-hint",
                    content: new Icon(iconName),
                })] : []),
            ],
            events: [
                {
                    event: "click",
                    async handler(e) {
                        ContextMenu({
                            generate: false,
                            ...contextParams,
                            content: context => builder(input, context),
                            event: e,
                            disableResizeHide,
                        })
                    },
                },
            ],
            objectProperty: [
                {
                    name: "currentValue",
                    get() {
                        return input.currentValue
                    },
                },
                {
                    name: "changeValue",
                    handler(n) {
                        input.emitEvent("editValue", { content: n })
                    },
                },
            ],
        })
    }
}
