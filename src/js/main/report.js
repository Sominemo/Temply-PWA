import App from "./app"
import errorToObject from "../tools/transformation/object/errorToObject"
import DBTool from "../tools/db/DBTool"

export default class Report {
    static DBConnection = new DBTool("LogData", 1, (upgradeDB) => {
        if (upgradeDB.oldVersion === 0) {
            upgradeDB.createObjectStore(this.StorageName, {
                keyPath: "key",
                autoIncrement: true,
            })
        }
    })

    static StorageName = "console-output"

    static trace() {
        let stack = new Error().stack || ""
        stack = stack.split("\n").map(line => line.trim())
        return stack.splice(stack[0] === "Error" ? 2 : 1)
    }

    static write(...log) {
        const lines = this.trace()
        this.saveToDB(
            ...log.map(re => (re instanceof Error ? errorToObject(re) : re)),
            lines,
        )
        if (App.debug) {
            console.log(...log)
            console.groupCollapsed("Trace")
            lines.forEach((line) => {
                console.log(line)
            })
            console.groupEnd()
        }
    }

    static async saveToDB(...log) {
        if (log.length === 1) [log] = log
        const r = await this.DBConnection.getObjectStore(this.StorageName, true)
            .then(a => a.add(log))
        return r
    }

    static get allLog() {
        return new Promise((resolve, reject) => {
            this.DBConnection.getObjectStore(this.StorageName).then(a => a.getAll())
                .then(res => resolve(res))
        })
    }
}
