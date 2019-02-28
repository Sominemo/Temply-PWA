import FieldsContainer from "../../tools/validation/fieldsContainer"
import FieldChecker from "../../tools/validation/fieldChecker"

export default class SettingsCheckProvider {
    static rules = {
        user: new Map(),
        flags: new Map(),
    }

    static updates = {
        user: new Map(),
        flags: new Map(),
    }

    static setRules(rules, type = "user") {
        new FieldsContainer([
            "array",
            new FieldsContainer([["name", "rule"], {
                name: new FieldChecker({ type: "string" }),
                rule:
                    new FieldsContainer([
                        ["default"],
                        {
                            checker: new FieldChecker({ type: "object" }),
                            onfail: new FieldChecker({ type: "function" }),
                            onupdate: new FieldChecker({ type: "function" }),
                        },
                    ]),
            },
            ]),
        ]).set(Object.values(rules))

        rules.forEach((e) => {
            const cha = this.get(e.name, type)
            this.rules[type].set(e.name, [...(Array.isArray(cha) ? cha : []), e.rule])
        })
    }

    static check(rule, value, type = "user") {
        if (typeof rule !== "string" || typeof type !== "string") throw new Error("Incorrect key")

        const ri = this.rules[type].get(rule)
        if (!Array.isArray(ri)) return [true, () => { }, undefined, () => { }]
        let success = true
        let rc
        try {
            ri.forEach((r) => {
                if (!Object.prototype.hasOwnProperty.call(r, "onfail")) r.onfail = () => { }
                if (!Object.prototype.hasOwnProperty.call(r, "onupdate")) r.onupdate = () => { }

                rc = r

                try {
                    if (Object.prototype.hasOwnProperty.call(r, "checker")) success = r.checker.set(value)
                    else success = true
                } catch (e) {
                    success = false
                    throw new Error("Setting check failed")
                }

                if (Array.isArray(this.updates[type].get(rule))) {
                    const of = r.onupdate
                    r.onupdate = (...params) => {
                        of(...params)
                        this.updates[type].get(rule).forEach((e) => {
                            if (typeof e === "function") e(...params)
                        })
                    }
                }
            })
        } catch (e) {
            // Just fail
        }
        return [success, rc.onfail, rc.default, rc.onupdate]
    }

    static get(rule, type = "user") {
        return this.rules[type].get(rule)
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
