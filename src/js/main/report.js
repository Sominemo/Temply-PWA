import { openDb } from "idb"
import App from "./app"

export default class Report {
    static DBConnection = null

    static DBName = "LogData"

    static StorageName = "console-output"

    static trace() {
        let stack = new Error().stack || ""
        stack = stack.split("\n").map(line => line.trim())
        return stack.splice(stack[0] === "Error" ? 2 : 1)
    }

    static write(...log) {
        if (App.debug) {
            const lines = this.trace()
            this.saveToDB(...log, lines)
            console.log(...log)
            console.groupCollapsed("Trace")
            lines.forEach((line) => {
                console.log(line)
            })
            console.groupEnd()
        }
    }

    static saveToDB(...log) {
        if (log.length === 1) [log] = log
        this.getTransaction().then((connection) => {
            connection.objectStore(this.StorageName).add(log)
        })
    }

    static get allLog() {
        return new Promise((resolve, reject) => {
            this.getTransaction(true)
                .then(connection => connection.objectStore(this.StorageName).getAll())
                .then(res => resolve(res))
        })
    }

    static getTransaction(readonly = false) {
        return new Promise((resolve, reject) => this.getDBConnection.then(db => resolve(db.transaction(this.StorageName, (readonly ? "readonly" : "readwrite")))))
    }

    static get getDBConnection() {
        return new Promise((resolve, reject) => {
            if (this.DBConnection !== null) resolve(this.DBConnection)
            else {
                this.openDB.then(r => resolve(r))
            }
        })
    }

    static get openDB() {
        return new Promise((resolve, reject) => {
            openDb(this.DBName, 1, (upgradeDB) => {
                if (upgradeDB.oldVersion === 0) {
                    upgradeDB.createObjectStore(this.StorageName, {
                        keyPath: "key",
                        autoIncrement: true,
                    })
                }
            }).then((db) => {
                this.DBConnection = db
                resolve(db)
            })
        })
    }
}
