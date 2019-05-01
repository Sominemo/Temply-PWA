export default function TimeToDigital(time) {
    const hours = (time[1] > 9 ? `${time[1]}` : `0${time[1]}`)
    const minutes = (time[2] > 9 ? `${time[2]}` : `0${time[2]}`)
    return `${hours}:${minutes}`
}
