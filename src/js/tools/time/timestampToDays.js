export default function TimestampToDays(timestamp = new Date()) {
    return Math.floor(timestamp.getTime() / 86400000)
    // 24*60*60*1000
}
