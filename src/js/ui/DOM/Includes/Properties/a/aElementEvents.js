import DOMController from "../../../Helpers/domController"
import FieldsContainer from "../../../../../tools/validation/fieldsContainer"
import FieldChecker from "../../../../../tools/validation/fieldChecker"

export default (() => {
    const unique = "DOMeventsSetter"

    const error = (data) => {
        if (!DOMController.errorIgnore(unique)) throw new Error("DOM Events set failed")
    }

    function handler(data) {
        if (typeof data.value !== "object") {
            if (!DOMController.errorIgnore(unique)) throw new Error("DOM Events must be object")
            return
        }

        let w = data.value
        if (!Array.isArray(data.value)) w = [data.value]

        try {
            new FieldsContainer([
                "array",
                new FieldsContainer([
                    ["event", "handler"],
                    {
                        event: new FieldChecker({ type: "string" }),
                        handler: new FieldChecker({ type: "function" }),
                    },
                ]),
            ]).set(w)
        } catch (e) {
            if (!DOMController.errorIgnore(unique)) throw new Error("DOM Events must be CORRECT object")
            return
        }

        w.forEach((e) => {
            try {
                const self = this

                data.event.on(e.event,
                    // eslint-disable-next-line prefer-arrow-callback, func-names
                    function (...ep) {
                        return e.handler.bind(this)(...ep, self)
                    }, (w.params ? w.params : {}))
            } catch (e2) {
                if (!DOMController.errorIgnore(unique)) throw new Error("Failed to set an event listener")
            }
        })
    }

    DOMController.registerProperty({
        name: "elementEvents",
        required: false,
        handler,
        error,
        unique,
    })
})()
