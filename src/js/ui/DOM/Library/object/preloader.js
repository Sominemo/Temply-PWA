import Design from "../../../../main/design"
import { SVG } from "../basic"

export default class Preloader {
    constructor({
        main, accent, size = 64, style = {},
    } = {}) {
        main = main || Design.getVar("color-main", true)
        accent = accent || Design.getVar("color-accent", true)
        let svg = require("Resources/images/vector/preloader.svg")
        svg = svg.replace(/\$mainColor\$/g, main).replace(/\$accentColor\$/g, accent)

        return new SVG(svg, { width: (typeof size === "number" ? `${size}px` : size), ...style })
    }
}
