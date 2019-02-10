import DOMController from "../../Helpers/domController"

export default (() => {
    const unique = "valueSetter"

    const error = (data) => {
        if (!DOMController.errorIgnore(unique)) throw new Error("Can't apply value")
        return data.element
    }

    const handler = (data) => {
        if (!("value" in data.element.native)) error()

        data.element.native.value = data.value

        return data.element
    }

    DOMController.registerProperty({
        name: "value",
        required: false,
        unique,
        handler,
        error,
    })
})()
