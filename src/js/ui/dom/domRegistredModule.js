import DOMController from "./domController"

export default class DomRegistredModule {
    constructor(id) {
        const data = DOMController.getPropertyData(id)
        if (typeof data !== "object") throw new Error("Incorrect module ID")

        this.id = id
    }

    get data() {
        return DOMController.getModuleData(this.id)
    }
}
