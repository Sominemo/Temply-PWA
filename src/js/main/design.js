export default class Design {
    static theme = "default"

    static themeObject = false

    static getVar(name, value = false, float = false) {
        if (!value) return `var(--${name})`
        if (typeof name !== "string") throw new TypeError("CSS variables are set in strings only")

        let get = getComputedStyle(document.head).getPropertyValue(`--${name}`).trim()

        if (float) get = parseFloat(get)

        return get
    }

    static async themeLoader(name) {
        if (typeof name === "string") {
            localStorage.setItem("temply_ui_theme", name)
        } else name = localStorage.getItem("temply_ui_theme")
        if (name === null) return

        let theme = false

        if (name !== "default") {
            theme = await require(`Resources/styles/colors/${name}.theme.css`)
            theme.use()
        }

        const tm = document.head.querySelector("[name=\"theme-color\"][content]")
        if (tm !== null) tm.content = this.getVar("color-main-bg", true)
        else {
            const tmc = document.createElement("meta")
            tmc.content = this.getVar("color-main-bg", true)
            document.head.appendChild(tmc)
        }
        if (this.themeObject) this.themeObject.unuse()
        this.themeObject = theme
        this.theme = name
    }
}
