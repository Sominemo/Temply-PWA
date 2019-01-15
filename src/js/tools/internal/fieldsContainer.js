import FieldCheckerError from "./fieldCheckerError"
import FieldChecker from "./fieldChecker"

export default class FieldsContainer {
    data = false;

    type = false;

    array = false

    constructor(a) {
        this.setRules(a)
        if (!(0 in this.type) || !(1 in this.type)) {
            this.type = false
        }
    }

    setRules(a) {
        if (typeof a !== "object" && !Array.isArray(a)) throw new FieldCheckerError(1, "Not array/object")
        const tr = a
        if (tr[0] === "array") {
            if (!Array.isArray(a)) throw new FieldCheckerError(1, "Not array")
            tr[0] = [...Array(a.length - 1)].map((_, i) => i)
            tr[1] = Array(a.length - 1).fill(tr[1])
            this.array = true
        }
        this.type = tr
    }

    set(a) {
        const tr = this.type
        if (!tr) throw new FieldCheckerError(3, "No rules defined")
        const e = []
        if (this.array && !Array.isArray(a)) throw new FieldCheckerError(4, "Not array")

        tr[0].forEach((v) => {
            let sc = 0
            if (!(v in a)) throw new FieldCheckerError(3, `No required item ${v}`)
            if (v in tr[1]) {
                let y = null
                if (tr[1][v] instanceof FieldChecker || tr[1][v] instanceof FieldsContainer) {
                    y = tr[1][v]
                    sc = 1
                }
                if (sc) {
                    y.set(a[v])
                }
            }
            e[v] = a[v]
        })
        this.data = e
        return true
    }

    get() {
        return this.data
    }

    getType() {
        return this.type
    }
}
