import DOMController from "../../Helpers/domController"
import Report from "../../../../main/report"
import DOM from "../../Classes/dom"

DOMController.registerModificator({
    name: "render",
    handler(...a) {
        a.forEach((e) => {
            try {
                if (e === null) return
                if (typeof e === "string") e = new DOM({ type: "text", new: e })
                this.elementParse.render(e)
            } catch (er) {
                Report.write("Render error", er)
            }
        })
    },
})
