import FieldCheckerError from "./fieldCheckerError"

export default class FieldChecker {
    rules = false;

    data = false;

    constructor(r) {
        if (typeof r !== "object") {
            throw new FieldCheckerError(1, "Not object")
        }

        this.rules = r
    }

    set(q) {
        const e = this.strCheck(q)
        if (!e) {
            throw new FieldCheckerError(2, { incorrect_value: q })
        }

        this.data = q
        return true
    }

    get() {
        return this.data
    }

    getRules() {
        return this.rules
    }

    strCheck(q) {
        const or = q
        q = q.toString()
        const o = this.rules
        if (!typeof o === "object" || typeof q !== "string") {
            return false
        }

        const p = Object.create(null)
        p.length = q.length
        // MIN Length
        if (Object.prototype.hasOwnProperty.call(o, "min")) {
            if (p.length < o.min) {
                return false
            }
        }
        // MAX Length
        if (Object.prototype.hasOwnProperty.call(o, "max")) {
            if (p.length > o.max) {
                return false
            }
        }
        // RegExp
        if (Object.prototype.hasOwnProperty.call(o, "regex")) {
            if (!o.regex.test(q)) {
                return false
            }
        }
        // Symbols
        if (Object.prototype.hasOwnProperty.call(o, "symbols")) {
            const slq = o.symbols
            if (!new RegExp(`^([${slq}]+)?$`).test(q)) {
                return false
            }
        }
        // Numeric
        if (Object.prototype.hasOwnProperty.call(o, "numeric") && o.numeric === true) {
            if (Number.isNaN(Number(q))) {
                return false
            }
        }
        // IsInt
        if (Object.prototype.hasOwnProperty.call(o, "isint")) {
            if (Number(q) !== parseInt(q, 10)) {
                return false
            }
        }
        // IntRange
        if (Object.prototype.hasOwnProperty.call(o, "range") && !Number.isNaN(q)) {
            if (!Number.isNaN(o.range[0])
                && !Number.isNaN(o.range[1])
                && !Number.isNaN(o.range[1])) { // TODO
                o.range[0] = Number(o.range[0])
                o.range[1] = Number(o.range[1])
                if (q < o.range[0] || q > o.range[1]) {
                    return false
                }
            } else if (1 in o.range && 0 in o.range) {
                o.range[0] = Number(o.range[0])
                if (q > o.range[0]) {
                    return false
                }
            }
        }

        // OfType
        if (Object.prototype.hasOwnProperty.call(o, "type") && typeof o.type === "string") {
            // eslint-disable-next-line valid-typeof
            if (typeof or !== o.type) {
                return false
            }
        }

        // Checker
        if (Object.prototype.hasOwnProperty.call(o, "checker") && (Array.isArray(o.checker) || typeof o.checker === "function")) {
            let checkers

            if (!Array.isArray) checkers = [o.checker]
            else { checkers = o.checker }

            try {
                checkers.every(e => e(q, or))
            } catch (e) {
                return false
            }
        }

        // InstanceOf
        if (Object.prototype.hasOwnProperty.call(o, "instanceOf") && typeof Array.isArray(o.instanceOf)) {
            let checkFunc
            if (typeof or === "function") checkFunc = e => or.name === e
            if (typeof or === "object" && typeof or.constructor === "function") checkFunc = e => or.constructor.name === e
            else return false
            if (!o.instanceOf.some(checkFunc)) return false
        }

        return true
    }
}
