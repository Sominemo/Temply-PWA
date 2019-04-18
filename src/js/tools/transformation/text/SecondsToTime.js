export default function SecondsToTime(time) {
    const d = Number(time)
    const h = Math.floor(d / 3600)
    const m = Math.floor((d % 3600) / 60)
    const s = Math.floor(d % 3600 % 60)
    return [d, h, m, s]
}
