import DOMController from "../../Helpers/domController"
import FieldsContainer from "../../../../tools/validation/fieldsContainer"
import FieldChecker from "../../../../tools/validation/fieldChecker"

export default (() => {
    const unique = "eventsSetter"

    const error = (data) => {
        if (!DOMController.errorIgnore(unique)) throw new Error("Events set failed")
    }

    const handler = (data) => {
        if (typeof data.value !== "object") {
            if (!DOMController.errorIgnore(unique)) throw new Error("Events must be object")
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
            if (!DOMController.errorIgnore(unique)) throw new Error("Events must be CORRECT object")
            return
        }

        w.forEach((e) => {
            try {
                data.element.native.addEventListener(e.event, e.handler)
                try {
                    if (data.config.eventsOnClickAutoTabIndex === true
                        && ["click"]
                            .includes(e.event)) {
                        data.element.native.tabIndex = 0
                    }
                } catch (e3) {
                    // This automation is not neccessary
                }
            } catch (e2) {
                if (!DOMController.errorIgnore(unique)) throw new Error("Failed to set a property")
            }
        })
    }

    DOMController.registerProperty({
        name: "events",
        required: false,
        handler,
        error,
        unique,
    })
})()
