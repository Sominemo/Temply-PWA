import FieldChecker from "../../tools/internal/fieldChecker"
import DOMController from "./domController"

export default class DOM {
    elementParse = null

    object = Object.create(null)

    storage = Object.create(null)

    constructor(object) {
        new FieldChecker({ type: "object" }).set(object)
        this.object = object

        this.propertyWorker()
    }

    propertyWorker() {
        const o = this.object
        const prop = DOMController.getProperties()
        let el = this.elementParse
        const sharedStorage = this.storage

        prop.forEach((p) => {
            if (p.required || Object.prototype.hasOwnProperty.call(o, p.name)) {
                let r
                const rewrite = (value) => {
                    o[p.name] = value
                }

                try {
                    r = p.handler({
                        element: el,
                        value: o[p.name],
                        all: o,
                        config: DOMController.config,
                        rewrite,
                        shared: sharedStorage,
                    })
                } catch (e) {
                    r = p.error({
                        element: el,
                        value: o[p.name],
                        all: o,
                        config: DOMController.config,
                        rewrite,
                        shared: sharedStorage,
                        error: e,
                    })
                }

                if (r !== undefined) el = r
            }
        })

        this.object = o
        this.elementParse = el
        this.storage = sharedStorage
    }

    get element() {
        return this.elementParse
    }

    get callbackElement() {
        return [this.element, () => { }]
    }

    get elementView() {
        return this.elementParse
    }
}
