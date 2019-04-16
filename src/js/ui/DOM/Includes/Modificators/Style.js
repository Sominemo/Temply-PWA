import DOMController from "../../Helpers/domController"
import camelCaseConverter from "../../../../tools/transformation/text/camelCaseConverter"

DOMController.registerModificator({
    name: "style",
    handler(a) {
        if (typeof a !== "object") return
        Object.keys(a).forEach((e) => {
            const value = a[e].toString()
            const r = value.match(/^(.+) !important$/)
            this.elementParse.native.style.setProperty(camelCaseConverter(e, "-", true), (r ? r[1] : value), (r ? "important" : ""))
        })
    },
})
