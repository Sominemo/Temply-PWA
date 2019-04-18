import DOMController from "../../../Helpers/domController"

export default (() => {
    const unique = "htmlSet"

    const error = (err) => {
        if (!DOMController.errorIgnore(unique)) throw new Error("Failed to initiate HTML")
    }

    const handler = (data) => {
        let r
        if (data.value.length === 3) {
            r = document.createElementNS(data.value[1], data.value[2]);
            [r.innerHTML] = data.value
        } else {
            r = document.createElement("div")
            r.innerHTML = data.value
        }

        if (r.childNodes.length !== 1) {
            return r
        }

        if (r.firstElementChild === null) throw new Error("Incorrect HTML")

        return r.firstElementChild
    }

    DOMController.registerProperty({
        name: "html",
        required: false,
        unique,
        handler,
        error,
    })
})()
