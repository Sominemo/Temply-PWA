const git = require("git-rev-sync")
const fs = require("fs")
const path = require("path")

function getLastCommit(isProd) {
    if (isProd) {
        const commit = git.short()
        fs.writeFileSync(path.resolve(__dirname, "lastcommit.build"), commit)
        return commit
    }
    return fs.readFileSync(path.resolve(__dirname, "lastcommit.build"))
}

function parseMDFile(version, date) {
    let file = fs.readFileSync("changelog.md", "utf8")
    if (!file.match(/^# /)) {
        file = `# ${version} ${date}\n${file}`
        fs.writeFileSync("changelog.md", file)
    }
    const lastVersion = file.match(/^#.+\n+((.|\n)+?)(\n# |$)/)[1]

    const groups = lastVersion.match(/[^\n](.|\n)+?(?=\n?(\n## |$))/g)

    const groupsParsed = []

    groups.forEach((group) => {
        const name = group.substring(0, group.indexOf("\n")).match(/^## (.+)$/)[1]
        group = group.substring(group.indexOf("\n") + 1)

        const changes = group.split("\n").map((change) => {
            const chMatch = change.match(/(.) (.+)/)
            if (!chMatch) {
                if (change.length === 0) return undefined
                chMatch[1] = "other"
                chMatch[2] = change
            }
            return { type: chMatch[1], value: chMatch[2] }
        }).filter(e => e !== undefined)

        const added = []
        const removed = []
        const changed = []
        const other = []

        changes.forEach((change) => {
            let arr

            if (change.type === "+") arr = added
            else if (change.type === "-") arr = removed
            else if (change.type === "*") arr = changed
            else arr = other

            arr.push(change.value)
        })

        groupsParsed.push({
            name,
            list: {
                added,
                changed,
                removed,
                other,
            },
        })
    })

    return groupsParsed
}

module.exports = function getChangelog(isProd, version, date, repository) {
    const md = parseMDFile(version, date)

    if (!isProd) {
        md.push({
            name: "Development",
            list: {
                added: [],
                removed: [],
                changed: [],
                other: [
                    `Generate changelog by visiting [this link]("${repository.slice(4, -4)}/compare/${getLastCommit()}...master")`,
                ],
            },
        })
    }
    return md
}
