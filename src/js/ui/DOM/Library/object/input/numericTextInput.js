import TextInput from "./textInput"

export default class NumericTextInput {
    constructor({
        set = {}, style = {}, events = [], params = {},
    } = {}) {
        return new TextInput({
            set: {
                ...set,
                type: "number",
            },
            style,
            events: [
                {
                    event: "keypress",
                    handler(evt, el) {
                        let key

                        if (evt.type === "paste") {
                            key = evt.clipboardData.getData("text/plain")
                        } else {
                            key = evt.keyCode || evt.which
                            key = String.fromCharCode(key)
                        }
                        const regex = /[0-9]|\./
                        if (!regex.test(key)) {
                            evt.returnValue = false
                            if (evt.preventDefault) evt.preventDefault()
                        }
                    },
                },
                ...events,
            ],
            params,
        })
    }
}
