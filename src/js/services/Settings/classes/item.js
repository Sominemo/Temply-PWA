import SettingsGroup from "./group"
import FieldsContainer from "../../../tools/internal/fieldsContainer"
import FieldChecker from "../../../tools/internal/fieldChecker"

export default class SettingsItem {
    _data = {}

    _parent = false

    generatedInstance = false

    constructor(data, parent) {
        if (!(parent instanceof SettingsGroup)) throw new TypeError("Only Settings Group can be a parrent")

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

    get id() {
        return this._data.id
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

    get children() {
        return this._children
    }

    get layout() {
        return this._parent.layout
    }
}
