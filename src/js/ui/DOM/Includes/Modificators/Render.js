import DOMController from "../../Helpers/domController"

DOMController.registerModificator({
    name: "render",
    handler(...a) {
        a.forEach((e) => {
            try {
                this.elementParse.render(e)
            } catch (er) {
                // Error during rendering
            }
        })
    },
})
