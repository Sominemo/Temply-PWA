export default function DaysToTimestamp(days) {
    return new Date(days * 86400000)
    // 24*60*60*1000
}
