import DOMController from "../../Helpers/domController"

export default (() => {
    const unique = "idSetter"

    const error = (data) => {
        if (!DOMController.errorIgnore(unique)) throw new Error("Can't apply id")
        return data.element
    }

    const handler = (data) => {
        if (!("id" in data.element)) error()

        data.element.native.id = data.value

        return data.element
    }

    DOMController.registerProperty({
        name: "id",
        required: false,
        unique,
        handler,
        error,
    })
})()
