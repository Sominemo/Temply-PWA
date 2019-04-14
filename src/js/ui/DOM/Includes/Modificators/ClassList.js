import DOMController from "../../Helpers/domController"

DOMController.registerModificator({
    name: "classList",
    get() {
        const self = this
        return {
            add(...a) {
                return self.elementParse.native.classList.add(...a)
            },
            remove(...a) {
                return self.elementParse.native.classList.remove(...a)
            },
            list() {
                return self.elementParse.native.classList
            },
            contains(a) {
                return self.elementParse.native.classList.contains(a)
            },
            replace(a, b) {
                return self.elementParse.native.classList.replace(a, b)
            },
        }
    },
})
