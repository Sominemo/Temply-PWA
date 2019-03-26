import DOMController from "../../Helpers/domController"
import FieldsContainer from "../../../../tools/validation/fieldsContainer"
import FieldChecker from "../../../../tools/validation/fieldChecker"

export default (() => {
    const unique = "onRenderedSet"

    const error = (data) => {
        if (!DOMController.errorIgnore(unique)) throw new Error("Failed with setting OnRendered listeners")
        return data.element
    }

    const handler = (data) => {
        if (!Array.isArray(data.value)) data.value = [data.value]
        new FieldsContainer(["array",
            new FieldChecker({ type: "function" }),
        ]).set(data.value)

        data.value.forEach((co) => {
            data.event.on("rendered", (...params) => {
                co(...params)
            })
        })
    }

    DOMController.registerProperty({
        name: "onRendered",
        required: false,
        unique,
        handler,
        error,
    })
})()
