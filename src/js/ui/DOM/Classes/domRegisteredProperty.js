import DOMController from "../Helpers/domController"

export default class DomRegisteredProperty {
    constructor(id) {
        const data = DOMController.getPropertyData(id)
        if (typeof data !== "object") throw new Error("Incorrect property ID")

        this.id = id
    }

    get data() {
        return DOMController.getPropertyData(this.id)
    }
}
