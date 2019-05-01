export default function timeToSeconds(data) {
    data = data.split(":").map((e) => {
        const r = parseInt(e, 10)
        if (Number.isNaN(r)) return 0
        return r
    })
    if (!(1 in data)) data[1] = 0
    if (!(2 in data)) data[2] = 0
    return data[0] * 3600 + data[1] * 60 + data[2]
}
