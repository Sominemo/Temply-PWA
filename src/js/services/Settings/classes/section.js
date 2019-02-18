import FieldsContainer from "../../../tools/internal/fieldsContainer"
import FieldChecker from "../../../tools/internal/fieldChecker"
import SettingsAct from "./act"

export default class SettingsSection {
    _data = {}

    _parent = false

    generatedInstance = false

    constructor(data, parent) {
        if (!(parent instanceof SettingsAct)) throw new TypeError("Only Settings Act can be a parrent")

        this._parent = parent

        new FieldsContainer([
            ["id", "dom"],
            {
                id: new FieldChecker({ type: "string", symbols: "a-zA-Z-" }),
                display: new FieldChecker({ type: "function" }),
                locked: new FieldChecker({ type: "function" }),
                dom: new FieldChecker({ type: "function" }),
                options: new FieldsContainer([
                    ["name"],
                    {
                        onupdate: new FieldChecker({ type: "function" }),
                        onfail: new FieldChecker({ type: "function" }),
                        name: new FieldChecker({ type: "string" }),
                    },
                ]),
            },
        ]).set(data)

        this._data = data
    }

    get onupdate() {
        return (e) => {
            this._parent.onupdate()
            if (typeof this._data.options.onupdate === "function") return this._data.options.onupdate()
            return true
        }
    }

    get onfail() {
        return (e) => {
            this._parent.onfail()
            if (typeof this._data.options.onfail === "function") return this._data.options.onfail()
            return true
        }
    }

    get parent() {
        return this._parent
    }
}
