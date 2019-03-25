import DOMController from "../../Helpers/domController"

DOMController.registerModificator({
    name: "sizes",
    get() {
        return this.elementParse.native.getBoundingClientRect()
    },
})
