import App from "./app"
import errorToObject from "../tools/transformation/object/errorToObject"
import DBTool from "../tools/db/DBTool"

export default class Report {
    static StorageName = "console-output"

    static _dbConnectionInstance = null

    static get DBConnection() {
        const self = this

        if (!this._dbConnectionInstance) {
            this._dbConnectionInstance = new DBTool("LogData", 1, {
                upgrade(db, oldVersion, newVersion, transaction) {
                    if (oldVersion === 0) {
                        db.createObjectStore(self.StorageName, {
                            keyPath: "key",
                            autoIncrement: true,
                        })
                    }
                },
            })
        }

        return this._dbConnectionInstance
    }


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
