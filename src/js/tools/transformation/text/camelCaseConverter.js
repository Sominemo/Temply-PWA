export default function camelCaseConverter(string, delimeter = "-") {
    return string.replace(RegExp(`${delimeter}(.)`, "g"), (match, p1) => p1.toUpperCase())
}
