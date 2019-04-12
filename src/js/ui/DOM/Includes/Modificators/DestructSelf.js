import DOMController from "../../Helpers/domController"

DOMController.registerModificator({
    name: "destructSelf",
    handler() {
        this.elementParse.native.parentElement.removeChild(this.elementParse.native)
    },
})
