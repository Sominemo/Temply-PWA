import HTML from "./html"

export default class SVG {
    constructor(file, style = {}) {
        return new HTML([file, "http://www.w3.org/2000/svg", "svg"], style)
    }
}
