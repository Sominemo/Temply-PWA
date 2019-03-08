import DOMController from "../../../Helpers/domController"

export default (() => {
    const unique = "callOnDone"

    const error = (data) => {
        if (!DOMController.errorIgnore(unique)) throw new Error("Can't call native method")
        return data.element
    }

    const handler = (data) => {
        if (!Array.isArray(data.value)) throw new TypeError("Incorrect values")

        data.value.forEach((e) => {
            let el = data.element
            while (e.length > 3) {
                el = el[e.shift()]
            }
            e[2](el[e[0]].bind(data.element.native)(e[1]), data.element.native)
        })
    }

    DOMController.registerProperty({
        name: "call",
        required: false,
        unique,
        handler,
        error,
    })
})()
