const {
    lstatSync, readdirSync, readFileSync, writeFileSync,
} = require("fs")
const { join } = require("path")

const isDirectory = source => lstatSync(source[0]).isDirectory()
const getDirectories = source => readdirSync(source)
    .map(name => [join(source, name), name])
    .filter(isDirectory)

function getLangMap(path) {
    const r = []
    const list = getDirectories(path)
    list.forEach((e) => {
        const p = join(e[0], "info.json")
        const i = JSON.parse(readFileSync(p));
        [, i.dir] = e
        r.push(i)
    })

    return r
}

module.exports = function makeLangMap(path) {
    const map = getLangMap(path)
    writeFileSync(join(path, "list.json"), JSON.stringify(map))
}
