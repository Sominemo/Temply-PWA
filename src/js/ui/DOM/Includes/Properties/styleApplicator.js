import DOMController from "../../Helpers/domController"
import camelCaseConverter from "../../../../tools/transformation/text/camelCaseConverter"

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

                const value = data.value[e].toString()
                const r = value.match(/^(.+) !important$/)
                data.element.native.style.setProperty(camelCaseConverter(e, "-", true), (r ? r[1] : value), (r ? "important" : ""))
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
