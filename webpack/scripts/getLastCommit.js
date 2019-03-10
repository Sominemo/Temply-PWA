const git = require("git-rev-sync")
const fs = require("fs")
const path = require("path")

module.exports = function getLastCommit(isProd) {
    if (isProd) {
        const commit = git.short()
        fs.writeFileSync(path.resolve(__dirname, "lastcommit"), commit)
        return commit
    }
    return fs.readFileSync(path.resolve(__dirname, "lastcommit"))
}
