import DOMController from "../domController"

export default () => {
    const unique = "propertySetter"

    const error = (data) => {
        if (!DOMController.errorIgnore(unique)) throw new Error("Properties set failed")
    }

    const handler = (data) => {
        if (typeof data.value !== "object") {
            if (!DOMController.errorIgnore(unique)) throw new Error("Properties field must be object")
            return
        }

        Object.keys(data.value).forEach((k) => {
            try {
                if (!(k in data.element)) {
                    error()
                    return
                }

                data.element[k] = data.value[k]
            } catch (e) {
                error()
            }
        })
    }

    DOMController.registerProperty({
        name: "set",
        required: false,
        handler,
        error,
        unique,
    })
}
