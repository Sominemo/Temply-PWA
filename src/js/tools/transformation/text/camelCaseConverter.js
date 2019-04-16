import escapeRegExp from "./escapeRegExp"

export default function camelCaseConverter(string, delimeter = "-", reverse = false) {
    return (reverse
        ? string.replace(/(?:^|\.?)([A-Z])/g, (x, y) => delimeter + y.toLowerCase()).replace(RegExp(`/^${escapeRegExp(delimeter)}/`), "")
        : string.replace(RegExp(`${delimeter}(.)`, "g"), (match, p1) => p1.toUpperCase())
    )
}
