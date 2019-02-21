import FieldsContainer from "../../../tools/internal/fieldsContainer"
import FieldChecker from "../../../tools/internal/fieldChecker"
import insert from "../../../tools/internal/arrayInsert"
import SettingsSection from "./section"
import SettingsItem from "./item"

export default class SettingsGroup {
    _data = {}

    _parent = false

    _children = []

    generatedInstance = false

    constructor(data, parent, children) {
        if (!(parent instanceof SettingsSection)) throw new TypeError("Only Settings Section can be a parrent")
        if (!(Array.isArray(children))) throw new TypeError("Children must be array")

        this._parent = parent
        this._children = children

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

    getItem(id) {
        const q = this.layout.getByID(id)
        if (!(q instanceof SettingsItem)) return false
        return q
    }

    createItem(p = {}, r = {}) {
        const { id } = p
        if (this.layout.isIdRegistered(id)) throw new Error("Such ID is already registered")
        const save = new SettingsItem(p, this)
        const insertion = {
            object: save,
        }
        this._children = insert(this._children, insertion, r)
        this.layout.mapRegister(id, save)
        return this
    }
}