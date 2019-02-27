import DOMController from "../../../Helpers/domController"
import DOMObjectWrapper from "../../../Helpers/domObjectWrapper"

export default (() => {
    const unique = "genericElement"

    const error = () => {
        throw new Error("Incorrect node constructor parameter")
    }

    const handler = (data) => {
        if (data.shared.elementConstructorSkipped) return DOMObjectWrapper(data.element)

        if (typeof data.value !== "string") error()
        data.element = DOMObjectWrapper(data.element(data.value))

        return data.element
    }

    DOMController.registerProperty({
        name: "new",
        required: true,
        unique,
        handler,
        error,
    })
})()
