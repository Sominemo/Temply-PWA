import DOMController from "./domController"

export default class DomRegistredProperty {
    constructor(id) {
        const data = DOMController.getPropertyData(id)
        if (typeof data !== "object") throw new Error("Incorrect property ID")

        this.id = id
    }

    get data() {
        return DOMController.getPropertyData(this.id)
    }
}
