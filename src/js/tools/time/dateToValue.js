export default function DateToValue(date = new Date()) {
    return `${date.getFullYear()}-${(date.getDate() < 10 ? `0${date.getDate()}` : date.getDate())}-${(date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1)}`
}
