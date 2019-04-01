import DOM from "../../../Classes/dom"
import { $$ } from "../../../../../services/Language/handler"
import Toast from "../../elements/toast"

export default class FileInput {
    constructor({ onchange = () => {}, methods = {}, maxSize = 0 } = {}) {
        const inputID = `file-input-${parseInt(Math.random() * (10 ** 10), 10)}`

        // eslint-disable-next-line prefer-const, no-unused-vars
        let file = null

        const presence = new DOM({
            new: "label",
            set: {
                htmlFor: inputID,
            },
            content: $$("select_file"),
            tabIndex: 1,
        })

        const holder = new DOM({
            new: "input",
            id: inputID,
            set: {
                type: "file",
            },
            events: [
                {
                    event: "change",
                    handler(...p) {
                        const thefile = holder.elementParse.native.files[0]
                        if (thefile === undefined) return
                        if (maxSize && thefile.size > maxSize) {
                            Toast.add($$("file_too_big"))
                            presence.clear(new DOM({ type: "text", new: $$("select_file") }))
                            return
                        }
                        presence.clear(new DOM({ type: "text", new: thefile.name }))
                        holder.elementParse.native.value = ""
                        onchange(thefile, ...p)
                    },
                },
            ],
        })

        const wrapper = new DOM({
            new: "md-file-wrapper",
            content: [
                presence,
                holder,
            ],
        })

        return wrapper
    }
}
