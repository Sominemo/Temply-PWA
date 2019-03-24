import DOM from "../Classes/dom"

// eslint-disable-next-line no-shadow
const DOMObjectWrapper = (DOMObjectWrapper) => {
    const goDeeper = (o, e) => o[e]

    const toTheBottom = (o, els, i = 0) => {
        if (typeof els === "string") {
            els = [els]
        } else if (Array.isArray(els)) {
            els = Array.from(els)
        } else {
            els = false
        }
        if (typeof o !== "object" || els === false) throw new TypeError("Incorrect parameters")
        while (els.length > i) {
            o = goDeeper(o, els.pop())
        }

        return o
    }

    const methods = {
        render: {
            value: (e) => {
                if (!(e instanceof DOM)) throw new TypeError("Can't render not-DOM element, use native methods")
                e.emitEvent("render", {})
                DOMObjectWrapper.appendChild(Object.getPrototypeOf(e.elementParse))
            },
            writable: false,
        },
        clear: {
            value: (e) => {
                DOMObjectWrapper.innerHTML = ""
                if (e) methods.render.value(e)
            },
            writable: false,
        },
        name: {
            value: "DOMObjectWrapper",
            writable: false,
        },
        native: {
            get() { return Object.getPrototypeOf(this) },
        },
        set: {
            value: (e, p) => {
                const g = toTheBottom(DOMObjectWrapper, e, 1)
                g[e[e.length - 1]] = p
                return g[e[e.length - 1]]
            },
            writable: false,
        },
        get: {
            value: e => toTheBottom(DOMObjectWrapper, e),
            writable: false,
        },
    }

    const wrapper = Object.create(DOMObjectWrapper, methods)

    return wrapper
}

export default DOMObjectWrapper
