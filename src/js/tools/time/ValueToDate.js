export default function ValueToDate(date) {
    const r = date.match(/^(([12]\d{3})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/)
    return [r[2], r[4], r[3]].map(e => parseInt(e, 10))
}
