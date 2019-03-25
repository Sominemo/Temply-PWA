import DOMController from "../../Helpers/domController"
import camelCaseConverter from "../../../../tools/transformation/text/camelCaseConverter"

DOMController.registerModificator({
    name: "getStyle",
    handler(name, { pseudo = null, returnType = "array" } = {}) {
        const styles = window.getComputedStyle(this.elementParse.native, pseudo)
        if (!name) return styles

        const results = []

        if (!Array.isArray(name)) name = [name]
        name.forEach((key) => {
            results.push(styles.getPropertyValue(key.toString()))
        })
        if (name.length === 1 && returnType !== "object") return results[0]

        if (returnType === "object") {
            return name.reduce((p, c, i) => {
                c = camelCaseConverter(c)
                p[c] = results[i]
                return p
            }, Object.create(null))
        }

        return results
    },
})
