import FieldsContainer from "../../../tools/internal/fieldsContainer"
import FieldChecker from "../../../tools/internal/fieldChecker"

export default class SettingsLayout {
    static _structure = []

    static _map = new Map()

    static _insert(a, i, { type, target }) {

    }

    static createAct({
        id,
        display,
        locked,
        element,
    }, r = {}) {
        new FieldsContainer([
            ["id", "dom"],
            {
                id: new FieldChecker({ type: "string", symbols: "a-zA-Z-" }),
                display: new FieldChecker({ type: "function" }),
                locked: new FieldChecker({ type: "function" }),
                dom: new FieldChecker({ type: "function" }),
                options: new FieldsContainer([
                    [],
                    {
                        onchange: new FieldChecker({ type: "function" }),
                    },
                ]),
            },
        ]).set({
            id, display, locked, element,
        })

        const save = {
            id,
            element,
            ...(display !== undefined ? display : {}),
            ...(locked !== undefined ? locked : {}),
        }

        if (this._map.has(id)) throw new Error(`Such id (${id}) is already exists`)

        this._insert(this._structure, save, r)
    }
}
