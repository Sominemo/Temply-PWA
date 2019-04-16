export default class Design {
    static theme = "default"

    static getVar(name, float = false) {
        if (typeof name !== "string") throw new TypeError("CSS variables are set in strings only")

        let get = getComputedStyle(document.body).getPropertyValue(`--${name}`).trim()

        if (float) get = parseFloat(get)

        return get
    }
}
