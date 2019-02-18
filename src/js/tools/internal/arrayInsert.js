export default function insert(a, i, { type = "insert", target, field = "id" }) {
    const ind = a.indexOf(el => el[field] === target)
    if (type === "insert") {
        a.push(i)
    } else if (type === "replace") {
        a[ind] = i
    } else {
        if (type === "before") a = a.splice(ind, 0, i)
        if (type === "after") a = a.splice(ind + 1, 0, i)
    }
    return a
}
