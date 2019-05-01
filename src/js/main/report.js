import App from "./app"
import errorToObject from "../tools/transformation/object/errorToObject"
import DBTool from "../tools/db/DBTool"
import { OutputRecovery } from "../recovery"

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

    static get DBOS() {
        if (this._dbOS) return this._dbOS
        const db = this.DBConnection
        this._dbOS = db.OSTool(this.StorageName)
        return this._dbOS
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
        OutputRecovery(...log, lines)
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
        try {
            if (log.length === 1) [log] = log
            const os = this.DBOS
            const r = os.add(log)
            return r
        } catch (e) {
            console.log("Failed DB log", e)
            return false
        }
    }

    static async allLog() {
        const os = this.DBOS
        const r = await os.getAll()
        return r
    }
}
