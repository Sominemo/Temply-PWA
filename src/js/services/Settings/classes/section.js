import FieldsContainer from "../../../tools/internal/fieldsContainer"
import FieldChecker from "../../../tools/internal/fieldChecker"
import SettingsAct from "./act"
import insert from "../../../tools/internal/arrayInsert"
import SettingsGroup from "./group"

export default class SettingsSection {
    _data = {}

    _parent = false

    _children = []

    generatedInstance = false

    constructor(data, parent, children) {
        if (!(parent instanceof SettingsAct)) throw new TypeError("Only Settings Act can be a parrent")
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

    getGroup(id) {
        const q = this.layout.getByID(id)
        if (!(q instanceof SettingsGroup)) return false
        return q
    }

    createGroup(p = {}, r = {}) {
        const { id } = p
        if (this.layout.isIdRegistered(id)) throw new Error("Such ID is already registered")
        const children = []
        const save = new SettingsGroup(p, this, children)
        const insertion = {
            object: save,
            children,
        }
        this._children = insert(this._children, insertion, r)
        this.layout.mapRegister(id, save)
        return this
    }
}
