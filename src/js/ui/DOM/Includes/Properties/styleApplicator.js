import DOMController from "../../Helpers/domController"

export default (() => {
    const unique = "styleApplicator"

    const error = (data) => {
        if (!DOMController.errorIgnore(unique)) throw new Error("Object doesn't support styles")
        return data.element
    }

    const handler = (data) => {
        if (!("style" in data.element.native)) error()

        Object.keys(data.value).forEach((e) => {
            try {
                if (!(e in data.element.native.style)) return

                data.element.native.style[e] = data.value[e]
            } catch (er) {
                // Ignore invalid styles
            }
        })

        return data.element
    }

    DOMController.registerProperty({
        name: "style",
        required: false,
        unique,
        handler,
        error,
    })
})()
