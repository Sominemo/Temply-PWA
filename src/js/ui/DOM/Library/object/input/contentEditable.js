import DOM from "../../../Classes/dom"
import { HTML } from "../../basic"

export default class ContentEditable {
    constructor({
        placeholder = "", change = (value, element) => { }, content = "", type = "", contentType = "text", methods = {},
        editable = true,
    }) {
        let value = ""

        const ip = new DOM({
            new: "md-input-content",
            content: (content === "" ? "" : new HTML(`<span>${String(content).replace(/\n/g, "<br>")}</span>`)),
            set: {
                ...(editable ? { contentEditable: "true" } : {}),
            },
            style: {
                // ...(type === "password" ? { "-webkit-text-security": "disc" } : {}),
            },
            events: [
                {
                    event: "paste",
                    handler(ev, el) {
                        ev.preventDefault()

                        const paste = (ev.clipboardData || window.clipboardData)
                            .getData(contentType)

                        const selection = window.getSelection()
                        if (!selection.rangeCount) return
                        selection.deleteFromDocument()
                        selection.getRangeAt(0).insertNode(document.createTextNode(paste))
                        selection.collapseToEnd()
                    },
                },
                {
                    event: "blur",
                    handler(ev, el) {
                        value = el.elementParse.native.innerText
                        change(value, el)
                    },
                },
            ],
        })

        const ph = new DOM({
            new: "md-input-placeholder",
            content: placeholder,
        })

        const wr = new DOM({
            new: "md-input",
            content: [
                ip,
                ph,
            ],
        })

        methods.edit = (evalue) => {
            ip.elementParse.native.innerText = evalue
            change(evalue, ip)
        }

        return wr
    }
}
