import SettingsGroup from "./group"
import FieldsContainer from "../../../tools/validation/fieldsContainer"
import FieldChecker from "../../../tools/validation/fieldChecker"
import Navigation from "../../../main/navigation"

export default class SettingsItem {
    _data = {}

    _parent = false

    generatedInstance = false

    constructor(data, parent) {
        if (!(parent instanceof SettingsGroup)) throw new TypeError("Only Settings Group can be a parrent")

        this._parent = parent

        new FieldsContainer([
            ["id", "dom", "options"],
            {
                id: new FieldChecker({ type: "string", symbols: "a-zA-Z-" }),
                display: new FieldChecker({ type: "function" }),
                locked: new FieldChecker({ type: "function" }),
                dom: new FieldChecker({ type: "function" }),
                events: new FieldsContainer([
                    [],
                    {
                        onupdate: new FieldChecker({ type: "function" }),
                        onfail: new FieldChecker({ type: "function" }),
                    },
                ]),
                options: new FieldChecker({ type: "object" }),
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
            if (typeof this._data.events.onupdate === "function") return this._data.events.onupdate()
            return true
        }
    }

    get onfail() {
        return (e) => {
            this._parent.onfail()
            if (typeof this._data.events.onfail === "function") return this._data.events.onfail()
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

    async render() {
        if ("display" in this._data && !(await this._data.display())) {
            return false
        }
        // eslint-disable-next-line new-cap
        this.generatedInstance = await new this._data.dom(this._data.options, Navigation.parse())
        return this.generatedInstance
    }
}
