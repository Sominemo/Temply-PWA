import DOMController from "../../Helpers/domController"
import Report from "../../../../main/report"

DOMController.registerModificator({
    name: "render",
    handler(...a) {
        a.forEach((e) => {
            try {
                this.elementParse.render(e)
            } catch (er) {
                Report.write("Render error", er)
            }
        })
    },
})
