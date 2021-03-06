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
    const multiline = file.split("\n")
    if (multiline[0] === "[LOCK]") {
        multiline.splice(0, 1)
        file = multiline.join("\n")
    }

    if (!file.match(/^# /)) {
        const string = `# ${version} ${date}`
        file = `${string}\n${file}`
        multiline.unshift(string)
        fs.writeFileSync("changelog.md", file)
    }
    const versionNumber = file.match(/^# ((?:0|[1-9]\d*)(?:\.(?:0|[1-9]\d*)){2}(?:-(?:(?:0|[1-9]\d*|\d*[A-z-][A-z\d-]*)(?:\.(?:0|[1-9]\d*|\d*[A-z-][A-z\d-]*))*))?(?:\+(?:\d*[A-z-][A-z\d-]*|\d+)(?:\.(?:\d*[A-z-][A-z\d-]*|\d+))*)?) .+/)[1]
    const packageJson = require(path.join(process.cwd(), "package.json"))
    if (versionNumber && versionNumber !== packageJson.version) {
        packageJson.version = versionNumber
        fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 4))
    }

    const lastVersion = file.match(/^#.+\n+((.|\n)+?)(\n# |$)/)[1]
    const groups = lastVersion.match(/[^\n](.|\n)+?(?=\n?(\n## |$))/g)
    const groupsParsed = []

    groups.forEach((group) => {
        const name = group.substring(0, group.indexOf("\n")).match(/^## (.+)$/)[1]
        group = group.substring(group.indexOf("\n") + 1)

        const changes = group.split("\n").map((change) => {
            let chMatch = change.match(/^(.) (.+)/)
            if (!chMatch) {
                if (change.length === 0) return undefined
                chMatch = [change, "other", change]
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

    return [groupsParsed, versionNumber]
}

module.exports = function getChangelog(isProd, version, date, repository) {
    const md = parseMDFile(version, date)

    const lastCommit = getLastCommit(isProd)

    if (!isProd) {
        md[0].push({
            name: "Development",
            list: {
                added: [],
                removed: [],
                changed: [],
                other: [
                    `Generate changelog by visiting [this link](${repository.slice(4, -4)}/compare/${lastCommit}...master)`,
                ],
            },
        })
    }

    try {
        const postChangelog = require("./config/postChangelog")
        postChangelog({ changelog: md[0], date, version: md[1] })
    } catch (e) {
        console.log("No post access")
    }

    return md
}
