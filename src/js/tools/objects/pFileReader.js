export default function pFileReader(file) {
    return new Promise((resolve, reject) => {
        const fr = new FileReader()
        fr.onload = (e) => {
            resolve(e.currentTarget.result)
        }
        fr.readAsText(file, "UTF-8")
    })
}
