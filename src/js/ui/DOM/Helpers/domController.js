import FieldsContainer from "../../../tools/internal/fieldsContainer"
import FieldChecker from "../../../tools/internal/fieldChecker"
import DomRegisteredProperty from "../Classes/domRegisteredProperty"
import DomRegisteredModule from "../Classes/domRegisteredModule"
import Report from "../../../main/report"
import DOM from "../Classes/dom"

export default class DOMController {
    static _settings = {
        modules: [

        ],
        properties: [

        ],
        modificators: [

        ],
        config: {

        },
        errorsIgnore: false,
    }

    // #region Properties
    static registerProperty(property) {
        if (this._settings.config.reportRegistration === true) Report.write("DOMController.Prop.New: ", property)
        new FieldsContainer([
            ["name", "required", "handler", "error", "unique"],
            {
                name: new FieldChecker({ type: "string", symbols: "a-zA-Z0-9" }),
                required: new FieldChecker({ type: "boolean" }),
                handler: new FieldChecker({ type: "function" }),
                error: new FieldChecker({ type: "function" }),
                unique: new FieldChecker({ type: "string", symbols: "a-zA-Z0-9" }),
            },
        ]).set(property)

        let compMethod

        if (this._settings.config.useFunctionsComparation) {
            compMethod = v => v.handler.toString() === property.handler.toString()
                && v.error.toString() === property.error.toString()
        } else {
            compMethod = v => v.unique === property.unique
        }

        const uncomp = this._settings.properties.findIndex(compMethod)
        if (uncomp !== -1) throw new Error(`Property is already registered with ID ${uncomp}`)

        const id = this._settings.properties.length
        this._settings.properties.push(property)

        return new DomRegisteredProperty(id)
    }

    static getPropertyData(id) {
        new FieldChecker({ isint: true }).set(id)

        const g = this._settings.properties[id]
        if (typeof g === "object") return g
        return false
    }

    static getProperties() {
        return this._settings.properties
    }

    // #endregion

    // #region Modules
    static registerModule(module) {
        new FieldsContainer([
            ["onRender"],
            {
                onRender: new FieldChecker({ type: "function" }),
            },
        ]).set(module)

        const id = this._settings.modules.length
        this._settings.modules.push()

        return new DomRegisteredModule(id)
    }

    static getModuleData(id) {
        new FieldChecker({ isint: true }).set(id)

        const g = this._settings.modules[id]
        if (typeof g === "object") return g
        return false
    }

    static getModules() {
        return this._settings.modules
    }

    // #endregion

    static get config() {
        return this._settings.config
    }

    static setConfig(v) {
        new FieldChecker({ type: "object" }).set(v)
        this._settings.config = v
    }

    static errorIgnore(s) {
        const g = this._settings.errorsIgnore
        const def = false
        s = s.toString()
        if (typeof g === "boolean") return g

        if (Array.isArray(g)) {
            const m = g.indexOf(s)
            if (m !== -1) return true
        }
        return def
    }

    static setErrorIgnore(n) {
        if (typeof n === "boolean") {
            this._settings.errorsIgnore = n
            return true
        }
        new FieldsContainer(["array", new FieldChecker({ type: "string" })]).set(n)
        this._settings.errorsIgnore = n
        return true
    }

    static registerModificator({ name, handler }) {
        new FieldsContainer([
            ["name", "handler"],
            {
                name: new FieldChecker({
                    type: "string",
                    symbols: "a-zA-Z",
                    min: 3,
                    max: 20,
                }),
                handler: new FieldChecker({ type: "function" }),
            },
        ]).set({ name, handler })

        if (this._settings.modificators[name] !== undefined
            || name in DOM.prototype) throw new Error(`Method ${name} is already declared`)

        Object.defineProperty(DOM.prototype, name,
            {
                value: handler,
                writable: false,
            })

        this._settings.modificators[name] = handler
    }

    static getModificator(name) {
        if (!(name in this._settings.modificators) || typeof this._settings.modificators[name] !== "function") {
            throw new Error("Incorrect modificator")
        }

        return this._settings.modificators[name]
    }
}
