import FieldsContainer from "../../tools/internal/fieldsContainer"
import FieldChecker from "../../tools/internal/fieldChecker"

export default class SettingsCheckProvider {
    static rules = {
        user: {},
        flags: {},
    }

    static updates = {
        user: {},
        flags: {},
    }

    static setRules(rules, type = "user") {
        new FieldsContainer([
            "array",
            new FieldsContainer([
                ["default"],
                {
                    checker: new FieldChecker({ instanceOf: ["FieldChecker", "FieldsContainer"] }),
                    onfail: new FieldChecker({ type: "function" }),
                    onupdate: new FieldChecker({ type: "function" }),
                },
            ]),
        ]).set(Object.values(rules))

        this.rules[type] = Object.assign(this.rules[type], rules)
    }

    static check(rule, value, type = "user") {
        if (typeof rule !== "string" || typeof type !== "string") throw new Error("Incorrect key")

        const r = this.rules[type][rule]
        if (typeof r !== "object") return [true, () => {}, undefined, () => {}]

        let success = true

        try {
            if (Object.prototype.hasOwnProperty.call(r, "checker")) success = r.checker.set(value)
            else success = true
        } catch (e) {
            success = false
        }

        if (!Object.prototype.hasOwnProperty.call(r, "onfail")) r.onfail = () => {}
        if (!Object.prototype.hasOwnProperty.call(r, "onupdate")) r.onupdate = () => {}

        if (Array.isArray(this.updates[type][rule])) {
            const of = r.onupdate
            r.onupdate = (...params) => {
                of(...params)
                this.updates[type][rule].forEach((e) => {
                    if (typeof e === "function") e(...params)
                })
            }
        }

        return [success, r.onfail, r.default, r.onupdate]
    }

    static get(rule, type = "user") {
        return this.rules[type][rule]
    }

    static addListener(key, func, type = "user") {
        if (!Array.isArray(this.updates[type][key])) this.updates[type][key] = []
        this.updates[type][key].push(func)
        return this.updates[type][key].length - 1
    }

    static removeListener(key, id, type = "user") {
        if (!Array.isArray(this.updates[type][key])) return
        delete this.updates[type][key][id]
    }
}
