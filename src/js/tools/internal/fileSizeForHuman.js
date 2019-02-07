const thresh = 1024
const units = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

export default function fileSizeForHuman(bytes) {
    if (Math.abs(bytes) < thresh) return `${bytes} B`
    let u = -1
    do {
        bytes /= thresh
        ++u
    } while (Math.abs(bytes) >= thresh && u < units.length - 1)

    return `${bytes.toFixed(1)} ${units[u]}`
}
