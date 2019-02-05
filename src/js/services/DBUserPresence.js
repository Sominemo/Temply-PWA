import FieldsContainer from "../tools/internal/fieldsContainer"
import FieldChecker from "../tools/internal/fieldChecker"

export default class DBUserPresence {
    static _register = []

    static registerNewPresence(data) {
        new FieldsContainer([
            ["id", "name", "description", "config", "actions"],
            {
                id: new FieldChecker({ type: "string", symbols: "a-zA-Z_" }),
                name: new FieldChecker({ tyle: "string", symbols: "a-zA-Z_\\-/" }),
                description: new FieldChecker({ type: "string" }),
                icon: new FieldChecker({ type: "string", symbold: "a-z_" }),
                quota: new FieldChecker({ type: "function" }),
                size: new FieldChecker({ type: "function" }),
                config: new FieldsContainer([
                    ["changable", "display"],
                    {
                        changable: new FieldChecker({ type: "boolean" }),
                        display: new FieldChecker({ type: "boolean" }),
                        min: new FieldChecker({ type: "number", checker: [q => q >= 0] }),
                        max: new FieldChecker({ type: "number", checker: [q => q >= 0] }),
                    },
                ]),
                actions: new FieldsContainer([
                    "array",
                    new FieldsContainer([
                        ["name"],
                        {
                            name: new FieldChecker({ type: "string" }),
                            handler: new FieldChecker({ type: "function" }),
                        },
                    ]),
                ]),
            },
        ]).set(data)
        if ("config" in data && data.config.changable === true) {
            if (!("min" in data.config)
                || !("max" in data.config)
                || data.config.max < data.config.min) throw new Error("Incorrect statement")
        }

        this._register.push(data)
    }

    static getAll() {
        return this._register
    }

    static get(id) {
        return this._register.find(e => e.id === id)
    }
}
