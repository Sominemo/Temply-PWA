import DOMController from "../domController"
import DOM from "../dom"
import FieldsContainer from "../../../tools/internal/fieldsContainer"
import FieldChecker from "../../../tools/internal/fieldChecker"

export default () => {
    const unique = "attributeSetter"

    const error = (data) => {
        if (!DOMController.errorIgnore(unique)) throw new Error("Can't apply attributes")
    }

    const handler = (data) => {
        if (data.element.nodeType !== 1) {
            error()
            return data.element
        }

        if (!Array.isArray(data.value)) {
            if (typeof data.value === "object") {
                const repl = []

                Object.keys(data.value).forEach((i) => {
                    repl.push({
                        name: i.replace(/([A-Z])/g, "-$1").toLowerCase(),
                        value: data.value[i],
                    })
                })
                data.value = repl
            } else data.value = [data.value]
        }

        data.value.forEach((attr) => {
            if (attr instanceof DOM) {
                if (data.config.allowDeprecatedAttributeConstructor !== true
                    || attr.elementView.nodeType !== 2) {
                    error()
                    return
                }

                attr = {
                    name: attr.elementView.nodeName,
                    value: attr.elementView.value,
                }
            }

            new FieldsContainer([
                ["name", "value"],
                { name: new FieldChecker({ type: "string" }) },
            ]).set(attr)

            data.element.setAttribute(attr.name, attr.value)
        })

        return data.element
    }

    DOMController.registerProperty({
        name: "attributes",
        required: false,
        unique,
        handler,
        error,
    })
}
