export default function rgbaAlpha(color, a) {
    const match = /rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*\d+[.\d+]*)*\)/g.exec(color)
    if (!match) return false
    a = a > 1 ? (a / 100) : a
    return `rgba(${[match[1], match[2], match[3], a].join(",")})`
}
