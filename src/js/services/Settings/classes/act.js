import FieldsContainer from "../../../tools/internal/fieldsContainer"
import FieldChecker from "../../../tools/internal/fieldChecker"
import SettingsLayout from "../user/layout"
import SettingsSection from "./section"
import insert from "../../../tools/internal/arrayInsert"

export default class SettingsAct {
    _data = {}

    generatedInstance = false

    _parent = false

    _children = []

    constructor(data, parent, children) {
        if (!(parent instanceof SettingsLayout)) throw new TypeError("Only Settings Layout can be a parrent")
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
            if (typeof this._data.options.onupdate === "function") return this._data.options.onupdate()
            return true
        }
    }

    get onfail() {
        return (e) => {
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
        return this._parent
    }

    getSection(id) {
        return this.children.find(e => e.object.id === id)
    }

    createSection(p = {}, r = {}) {
        const { id } = p
        if (this.layout.isIdRegistered(id)) throw new Error("Such ID is already registered")
        const children = []
        const save = new SettingsSection(p, this, children)
        const insertion = {
            object: save,
            children,
        }
        this._children = insert(this._children, insertion, r)
        this.layout.mapRegister(id, save)
    }
}
