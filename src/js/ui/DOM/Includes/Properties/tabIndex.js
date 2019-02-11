import DOMController from "../../Helpers/domController"

export default (() => {
    const unique = "tabIndex"

    const error = (data) => {
        if (!DOMController.errorIgnore(unique)) throw new Error("Can't apply tabIndex")
        return data.element
    }

    const handler = (data) => {
        if (!("tabIndex" in data.element)) error()

        data.element.native.tabIndex = data.value

        return data.element
    }

    DOMController.registerProperty({
        name: "tabIndex",
        required: false,
        unique,
        handler,
        error,
    })
})()
