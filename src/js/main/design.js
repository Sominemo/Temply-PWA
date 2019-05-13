import themesList from "Resources/styles/colors/list"
import Report from "./report"
import DOM from "../ui/DOM/Classes/dom"
import { $$ } from "../services/Language/handler"
import { SettingsSectionElement, SettingsGroupContainer } from "../ui/DOM/Library/settings"
import { RadioLabel } from "../ui/DOM/Library/object/input"

export default class Design {
    static theme = "default"

    static defaultTheme = "default"

    static themeObject = false

    static LSName = "temply_ui_theme"

    static themesList = themesList

    static getVar(name, value = false, float = false) {
        if (!value) return `var(--${name})`
        if (typeof name !== "string") throw new TypeError("CSS variables are set in strings only")

        let get = getComputedStyle(document.head).getPropertyValue(`--${name}`).trim()

        if (float) get = parseFloat(get)

        return get
    }

    static async themeLoader(name = null) {
        let newTheme = false

        // 1. Get requested theme name
        name = name || localStorage.getItem(this.LSName)
        if (name === null) return false

        // 2. Get theme object if not default
        if (name !== this.defaultTheme) {
            try {
                newTheme = await require(`Resources/styles/colors/${name}/theme.css`)
            } catch (e) {
                Report.write("Failed to load theme", e)
                throw new Error(1) // No such theme
            }
        }

        // 3. Disconnect current theme if present
        try {
            if (this.themeObject) {
                this.themeObject.unuse()
            }
        } catch (e) {
            throw new Error(2) // Failed disconnecting current theme
        }

        // 4. Connect new theme if needed
        try {
            if (newTheme) newTheme.use()
        } catch (e) {
            Report.write("Failed to connect theme", e, newTheme)
            throw new Error(3) // Failed connecting the theme
        }

        // 5. Update env colors
        try {
            const colorHead = this.getVar("color-main-bg", true)
            let metaItem = document.head.querySelector("[name=\"theme-color\"][content]")

            if (metaItem === null) {
                metaItem = document.createElement("meta")
                document.head.appendChild(metaItem)
            }

            metaItem.content = colorHead
        } catch (e) {
            // Failed to update the tag
        }

        // 6. Apply new settings
        this.themeObject = newTheme
        this.theme = name
        localStorage.setItem(this.LSName, name)

        return this.themeObject
    }

    static hexToLuma(hex) { // > 160 - bright
        const rgb = this.hexToRgb(hex)
        const luma = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
        return luma
    }

    static hexToRgb(hex) {
        const match = hex.match(RegExp("#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})", "i"))
        if (!match) return this.parseRgba(hex)
        const [r, g, b] = match
            .slice(1).map(n => parseInt(n, 16))

        return [r, g, b]
    }

    static parseRgba(str) {
        return str.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/).slice(1)
    }

    static generateThemesList(act) {
        const self = this
        const themes = this.themesList

        const list = themes.map(theme => ({
            content: new DOM({
                new: "div",
                content: [
                    new DOM({ new: "div", content: (theme.name_loc ? $$(`@settings/appearance/themes/names/${theme.name_loc}`) : theme.name) }),
                    new DOM({
                        new: "div",
                        style: {
                            display: "flex",
                            alignItems: "center",
                        },
                        content:
                            [
                                ...Object.values(theme.colors).map(color => new DOM({
                                    new: "div",
                                    style: {
                                        background: color,
                                        width: "10px",
                                        height: "10px",
                                        borderRadius: "50%",
                                        margin: "3px",
                                        boxShadow: "0px 0px 3px rgba(204, 204, 204, 0.9)",
                                    },
                                })),
                                new DOM({ new: "div", content: `| ${theme.author}`, style: { color: Design.getVar("color-generic-light-b"), fontSize: "12px", marginLeft: "5px" } }),
                            ],
                    }),
                ],
            }),
            handler(s) {
                if (!s) return
                self.themeLoader(theme.dir)
            },
            selected: () => (theme.dir === this.theme),
        }))

        act.createSection({ id: "theme-selection-section", dom: SettingsSectionElement, options: { name: $$("@settings/appearance/themes") } })
            .getSection("theme-selection-section")
            .createGroup({ id: "theme-selection-group", dom: SettingsGroupContainer, options: {} })
            .getGroup("theme-selection-group")
            .createItem({ id: "theme-selection-chooser-radios", dom: ({ items }) => new DOM({ new: "div", content: new RadioLabel(items, [], true) }), options: { items: list } })
    }
}
