import DOMController from "../../Helpers/domController"
import FieldsContainer from "../../../../tools/validation/fieldsContainer"
import FieldChecker from "../../../../tools/validation/fieldChecker"

export default (() => {
    const unique = "mutationListener"

    const error = (data) => {
        if (!DOMController.errorIgnore(unique)) throw new Error("Failed with setting MutationObserver")
        return data.element
    }

    const handler = (data) => {
        new FieldsContainer(["array",
            new FieldsContainer([
                ["handler"],
                {
                    config: new FieldChecker({ type: "object" }),
                    handler: new FieldChecker({ type: "function" }),
                },
            ]),
        ]).set(data.value)

        data.value.forEach((co) => {
            const mo = new MutationObserver(co.handler)

            data.event.on("render", (c) => {
                if (!c.asContent) return
                mo.observe(data.element.native, co.config)
            })
        })
    }

    DOMController.registerProperty({
        name: "mutations",
        required: false,
        unique,
        handler,
        error,
    })
})()
