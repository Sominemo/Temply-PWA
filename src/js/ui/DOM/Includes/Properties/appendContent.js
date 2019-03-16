import DOM from "../../Classes/dom"
import DOMController from "../../Helpers/domController"

export default (() => {
    const unique = "appendContent"

    const error = (data) => {
        if (!DOMController.errorIgnore(unique)) throw new Error(`Content of type ${typeof data.value} and not DOM instance is unapplicapable to this nodeType: ${data.element.get("nodeType")}`)
        return data.element
    }

    const handler = (data) => {
        if (data.element.get("nodeType") !== 1) error()

        if (!Array.isArray(data.value)) data.value = [data.value]

        data.shared.contentNodesCallback = []

        data.value.forEach((item) => {
            if (typeof item === "string" && DOMController.config.contentStringAsTextNode === true) {
                item = new DOM({
                    type: "text",
                    new: item,
                })
            }

            if (!(item instanceof DOM)) {
                if (DOMController.errorIgnore(unique)) return
                throw new Error("Can't apply not DOM-class object")
            }
            data.element.render(item)
        })

        data.event.on("render", () => {
            data.value.forEach((e) => {
                if (typeof e.emitEvent === "function") { e.emitEvent("render", { asContent: true }) }
            })
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
})()
