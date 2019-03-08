import DOMController from "../../Helpers/domController"

export default (() => {
    const unique = "srcSetter"

    const error = (data) => {
        if (!DOMController.errorIgnore(unique)) throw new Error("Can't apply src")
        return data.element
    }

    const handler = (data) => {
        if (!("src" in data.element)) error()

        data.element.native.src = data.value

        return data.element
    }

    DOMController.registerProperty({
        name: "src",
        required: false,
        unique,
        handler,
        error,
    })
})()
