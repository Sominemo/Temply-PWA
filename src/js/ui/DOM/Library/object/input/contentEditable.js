import DOM from "../../../Classes/dom"

export default class ContentEditable {
    constructor({
        placeholder = "", change = (value, element) => { }, content = "", type = "", contentType = "text",
        editable = true, onRendered = () => { }, style = {}, species = [], contentStyle = {},
        placeholderStyle = {}, transformString = true,
    }) {
        let value = content
        let ip
        let contentArray

        if (transformString) {
            contentArray = String(content).split(/\n/g).reduce((arr, b) => [...arr, b, new DOM({ new: "br" })], [])
            contentArray.pop()
        } else contentArray = content

        const methods = {
            elementEvents: [
                {
                    event: "editValue",
                    handler(ev) {
                        if (!("content" in ev)) throw new Error("Incorrect editValue event")
                        if (transformString) {
                            const evalue = String(ev.content)
                            ip.clear(new DOM({ type: "text", new: evalue }))
                            value = evalue
                            change(evalue, ip)
                        } else {
                            value = ev.content
                            ip.clear(ev.content)
                            change(value, ip)
                        }
                    },
                },
            ],
            objectProperty: [
                {
                    name: "currentValue",
                    get() {
                        return value
                    },
                },
            ],
        }

        ip = new DOM({
            new: "md-input-content",
            content: (content === "" ? "" : contentArray),
            set: {
                ...(editable ? { contentEditable: "true" } : {}),
            },
            style: {
                // ...(type === "password" ? { "-webkit-text-security": "disc" } : {}),
                ...contentStyle,
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
            ...methods,
            onRendered,
        })

        const ph = new DOM({
            new: "md-input-placeholder",
            content: placeholder,
            style: placeholderStyle,
        })

        const wr = new DOM({
            new: "md-input",
            class: species,
            content: [
                ip,
                ph,
            ],
            style,
            ...methods,
        })


        return wr
    }
}
