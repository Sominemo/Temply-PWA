import DOM from "../dom"
import DOMController from "../domController"

export default () => {
    const unique = "appendContent"

    const error = (data) => {
        if (!DOMController.errorIgnore(unique)) throw new Error(`Content is unapplicapable to this nodeType: ${data.element.nodeType}`)
        return data.element
    }

    const handler = (data) => {
        if (data.element.nodeType !== 1) error()

        if (typeof data.value === "string" && DOMController.config.contentStringAsTextNode === true) {
            data.value = new DOM({
                type: "text",
                new: data.value,
            })
        }

        if (!Array.isArray(data.value)) data.value = [data.value]

        data.shared.contentNodesCallback = []

        data.value.forEach((item) => {
            if (!(item instanceof DOM)) {
                if (DOMController.errorIgnore(unique)) return
                throw new Error("Can't apply not DOM-class object")
            }
            const res = item.callbackElement
            data.element.appendChild(res[0])
            data.shared.contentNodesCallback.push(res[1])
        })

        return data.element
    }

    DOMController.registerProperty({
        name: "content",
        required: false,
        unique,
        handler,
        error,
    })
}
