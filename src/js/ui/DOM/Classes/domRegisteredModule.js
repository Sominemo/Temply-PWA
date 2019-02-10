import DOMController from "../Helpers/domController"

export default class DomRegisteredModule {
    constructor(id) {
        const data = DOMController.getModuleData(id)
        if (typeof data !== "object") throw new Error("Incorrect module ID")

        this.id = id
    }

    get data() {
        return DOMController.getModuleData(this.id)
    }
}
