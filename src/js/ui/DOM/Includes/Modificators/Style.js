import DOMController from "../../Helpers/domController"

DOMController.registerModificator({
    name: "style",
    handler(a) {
        if (typeof a !== "object") return
        Object.keys(a).forEach((e) => {
            this.elementParse.native.style[e] = a[e].toString()
        })
    },
})
