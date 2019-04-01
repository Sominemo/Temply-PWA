import { $$ } from "../../../../../services/Language/handler"
import FieldsContainer from "../../../../../tools/validation/fieldsContainer"
import FieldChecker from "../../../../../tools/validation/fieldChecker"
import ContentEditable from "./contentEditable"
import RadioLabel from "./radioLabel"
import WindowManager from "../../../../SimpleWindowManager"
import { Popup } from "../../elements"
import FadeOut from "../../../../Animation/Library/Effects/fadeOut"
import DOM from "../../../Classes/dom"
import Design from "../../../../../main/design"
import Icon from "../icon"

export default class SelectInput {
    constructor({
        placeholder = $$("select_option"),
        options = [],
        defaultOption = -1,
        change = (option) => { },
        emptySelection = true,
    }) {
        new FieldsContainer(["array", new FieldsContainer([
            ["content", "value"],
            {
                content: new FieldChecker({ type: "string" }),
            },

        ])]).set(options)

        let selection = (defaultOption >= 0 ? options[defaultOption] : { content: "", value: null })

        const methods = {}

        const input = new ContentEditable({
            placeholder,
            editable: false,
            methods,
            content: selection.content,
        })

        const radioOptions = options.map((option, index) => ({
            content: option.content,
            handler(s) {
                if (!s) return
                selection = option
                methods.edit(option.content)
                change(option)
            },
            selected: index === defaultOption,
        }))

        if (emptySelection) {
            radioOptions.unshift({
                content: new DOM({ new: "span", content: "Select option", style: { color: Design.getVar("color-generic-light-b") } }),
                handler(s) {
                    if (!s) return
                    const ne = { content: "", value: null }
                    selection = ne
                    methods.edit("")
                    change(ne)
                },
                selected: defaultOption < 0,
            })
        }

        const selector = new RadioLabel(radioOptions)

        return new DOM({
            new: "md-select",
            content: [
                input,
                new DOM({
                    new: "div",
                    class: "md-select-hint",
                    content: new Icon("arrow_drop_down"),
                }),
            ],
            events: [
                {
                    event: "click",
                    handler() {
                        const o = WindowManager.newOverlay()

                        o.append(new Popup(selector, {
                            control: o,
                            fullWidth: true,
                            events: [
                                {
                                    event: "click",
                                    handler() {
                                        new FadeOut({ duration: 200 }).apply(o.element).then(o.pop)
                                    },
                                },
                            ],
                        }))
                    },
                },
            ],
        })
    }
}
