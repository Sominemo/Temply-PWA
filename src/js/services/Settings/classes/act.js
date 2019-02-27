import FieldsContainer from "../../../tools/validation/fieldsContainer"
import FieldChecker from "../../../tools/validation/fieldChecker"
import SettingsLayout from "../user/layout"
import SettingsSection from "./section"
import insert from "../../../tools/transformation/object/arrayInsert"
import Navigation from "../../../main/navigation"
import DOM from "../../../ui/DOM/Classes/dom"
import Title from "../../../ui/DOM/Library/object/title"
import Card from "../../../ui/DOM/Library/object/card/card"

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
            if (typeof this._data.events.onupdate === "function") return this._data.events.onupdate()
            return true
        }
    }

    get onfail() {
        return (e) => {
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
        return this._parent
    }

    render() {
        if ("display" in this._data && !(this._data.display())) {
            return new DOM({
                new: "div",
                content: [
                    new Title("Settings"),
                    new Card("There's no available settings for you at the moment"),
                ],
            })
        }
        this._data.options.lock = (this._data.lock ? !!this._data.lock() : false)
        // eslint-disable-next-line new-cap
        this.generatedInstance = new this._data.dom(this._data.options, Navigation.parse())
        this.children.forEach((e) => {
            const m = e.object.render()
            if (m) this.generatedInstance.render(m)
        })
        return this.generatedInstance
    }

    getSection(id) {
        const q = this.layout.getByID(id)
        if (!(q instanceof SettingsSection)) return false
        return q
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
        return this
    }
}
