import FieldChecker from "../../../tools/validation/fieldChecker"
import DOMController from "../Helpers/domController"
import FieldsContainer from "../../../tools/validation/fieldsContainer"
import Report from "../../../main/report"

export default class DOM {
    elementParse = null

    object = Object.create(null)

    storage = Object.create(null)

    events = Object.create(null)

    constructor(object) {
        new FieldChecker({ type: "object" }).set(object)
        this.object = object

        this.onEvent("render", (c = {}) => (c.asContent ? this._moduleWorkerOnRender : () => {}))
        this._propertyWorker()
    }

    onEvent(event, handler) {
        new FieldsContainer([
            ["event", "handler"],
            {
                event: new FieldChecker({ type: "string", min: 1 }),
                handler: new FieldChecker({ type: "function" }),
            },
        ]).set({ event, handler })

        if (!(event in this.events) || !Array.isArray(this.events[event])) this.events[event] = []

        this.events[event].push(handler.bind(this))
    }

    emitEvent(event, data) {
        new FieldsContainer([
            ["event", "data"],
            {
                event: new FieldChecker({ type: "string", min: 1 }),
                data: new FieldChecker({ type: "object" }),
            },
        ]).set({ event, data })

        if (!(event in this.events) || !Array.isArray(this.events[event])) return

        this.events[event].forEach((e) => {
            try {
                if (typeof e === "function") e(data, this)
            } catch (r) {
                // Ignore bad listeners
            }
        })
    }

    _propertyWorker() {
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
                    r = p.handler.bind(this)({
                        element: el,
                        value: o[p.name],
                        all: o,
                        config: DOMController.config,
                        rewrite,
                        shared: sharedStorage,
                        event: {
                            on: this.onEvent.bind(this),
                            emit: this.emitEvent.bind(this),
                        },
                    })
                } catch (e) {
                    Report.write("DOM Property error", e)
                    r = p.error.bind(this)({
                        element: el,
                        value: o[p.name],
                        all: o,
                        config: DOMController.config,
                        rewrite,
                        shared: sharedStorage,
                        event: {
                            on: this.onEvent.bind(this),
                            emit: this.emitEvent.bind(this),
                        },
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

    _moduleWorkerOnRender() {
        const o = this.object
        const prop = DOMController.getModules()
        let el = this.elementParse
        const sharedStorage = this.storage

        prop.forEach((p) => {
            let r
            const rewrite = (value) => {
                o[p.name] = value
            }

            try {
                r = p.handler.bind(this)({
                    element: el,
                    value: o[p.name],
                    all: o,
                    config: DOMController.config,
                    rewrite,
                    shared: sharedStorage,
                })
            } catch (e) {
                // Sometimes modules may work wrong,
                // but it mustn't break the DOM object
            }

            if (r !== undefined) el = r
        })
        this.object = o
        this.elementParse = el
        this.storage = sharedStorage
    }

    static extract(el) {
        if (!(el instanceof DOM)) throw new TypeError("Not a DOM object passed")

        return el.elementParse
    }
}
