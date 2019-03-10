import Design from "../../../../main/design"
import { SVG } from "../basic"

export default class Preloader {
    constructor({ main, accent, size = 64 } = {}) {
        main = main || Design.getVar("color-main")
        accent = accent || Design.getVar("color-accent")
        let svg = require("Resources/images/vector/preloader.svg")
        svg = svg.replace("$mainColor$", main).replace("$accentColor$", accent)

        return new SVG(svg, { width: (typeof size === "number" ? `${size}px` : size) })
    }
}
