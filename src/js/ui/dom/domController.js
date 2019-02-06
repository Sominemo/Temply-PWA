import FieldsContainer from "../../tools/internal/fieldsContainer"
import FieldChecker from "../../tools/internal/fieldChecker"
import DomRegistredProperty from "./domRegistredProperty"
import DomRegistredModule from "./domRegistredModule"
import Report from "../../main/report"

export default class DOMController {
    static _settings = {
        modules: [

        ],
        properties: [

        ],
        config: {

        },
        errorsIgnore: false,
    }

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
        if (uncomp !== -1) throw new Error(`Property is already registred with ID ${uncomp}`)

        const id = this._settings.properties.length
        this._settings.properties.push(property)

        return new DomRegistredProperty(id)
    }

    static getPropertyData(id) {
        new FieldChecker({ isint: true }).set(id)

        const g = this._settings.properties[id]
        if (typeof g === "object") return g
        return false
    }

    static registerModule(module) {
        new FieldChecker({ type: "array" }).set(module)
        if (1 in module && typeof module[1] !== "function") return false


        const id = this._settings.modules.length
        this._settings.modules.push()

        return new DomRegistredModule(id)
    }

    static getModuleData(id) {
        new FieldChecker({ isint: true }).set(id)

        const g = this._settings.modules[id]
        if (typeof g === "object") return g
        return false
    }

    static getProperties() {
        return this._settings.properties
    }

    static getModules() {
        return this._settings.modules
    }

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
}
