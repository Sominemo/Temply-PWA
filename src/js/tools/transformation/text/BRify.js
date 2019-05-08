import DOM from "../../../ui/DOM/Classes/dom"

export default function BRify(content) {
    return String(content).split(/\n/g).reduce((arr, b) => [...arr, b, new DOM({ new: "br" })], [])
}
