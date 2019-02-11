export default class Design {
    static theme = "default"

    static getVar(name) {
        if (typeof name !== "string") throw new TypeError("CSS variables are set in strings only")

        return getComputedStyle(document.body).getPropertyValue(`--${name}`).trim()
    }
}
