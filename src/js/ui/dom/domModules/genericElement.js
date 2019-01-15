import DOMController from "../domController"

export default () => {
    const unique = "genericElement"

    const error = () => {
        throw new Error("Incorrect node constructor parameter")
    }

    const handler = (data) => {
        if (data.shared.elementConstructorSkipped) return data.element

        if (typeof data.value !== "string") error()
        data.element = data.element(data.value)

        return data.element
    }

    DOMController.registerProperty({
        name: "new",
        required: true,
        unique,
        handler,
        error,
    })
}
