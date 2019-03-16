import DOM from "../../Classes/dom"

export default class ToastElement {
    constructor(content, buttons) {
        const toast = new DOM({
            new: "md-toast",
        })

        return toast
    }
}
