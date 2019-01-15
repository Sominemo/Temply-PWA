import DOMController from "../domController"

export default () => {
    const unique = "setClasses"

    const error = (data) => {
        if (!DOMController.errorIgnore(unique)) throw new Error("Class set failed")
    }

    const handler = (data) => {
        let w
        if (!Array.isArray(data.value)) w = [data.value.toString()]
        else w = data.value

        w.forEach((cls) => {
            data.element.classList.add(cls.toString())
        })
    }

    DOMController.registerProperty({
        name: "class",
        required: false,
        handler,
        error,
        unique,
    })
}
