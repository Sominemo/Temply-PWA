export default function executedObject(o) {
    if (typeof o !== "object") throw new TypeError("Only objects are supported")

    return o.map(e => (typeof e === "function" ? e() : e))
}
