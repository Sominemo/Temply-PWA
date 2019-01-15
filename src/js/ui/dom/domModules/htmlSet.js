import DOMController from "../domController"

export default () => {
    const unique = "htmlSet"

    const error = () => {
        if (!DOMController.errorIgnore(unique)) throw new Error("Failed to initiate HTML")
    }

    const handler = (data) => {
        const r = document.createElement("div")

        r.innerHTML = data.value

        if (r.childNodes.length !== 1) {
            return r
        }

        return r.firstElementChild
    }

    DOMController.registerProperty({
        name: "html",
        required: false,
        unique,
        handler,
        error,
    })
}
