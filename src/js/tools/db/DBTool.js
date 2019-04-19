// SOURCE: https://gist.github.com/tralves/9e5de2bd9f582007a52708d7d4209865

import { openDB, deleteDB } from "idb"
import ObjectStoreTool from "./ObjectStoreTool"

export default class DBTool {
    DBName = null

    DBVersion = 0

    DBConnection = null

    upgradeAgent = null

    size = Object.create(null)

    constructor(db, version,
        { upgrade = () => { }, blocked = () => { }, blocking = () => { } } = {}) {
        if (typeof db !== "string"
            || typeof version !== "number"
            || typeof upgrade !== "function"
            || typeof blocked !== "function"
            || typeof blocking !== "function") throw new Error("Incorrect DB params")

        this.DBName = db
        this.DBVersion = version
        this.upgradeAgent = upgrade
        this.blockedAgent = blocked
        this.blockingAgent = blocking
    }

    delete() {
        deleteDB(this.DBName)
    }

    getObjectStore(name, type = false) {
        return new Promise((resolve, reject) => {
            this.getTransaction(name, type).then(e => e.objectStore(name))
                .then(os => resolve(os))
        })
    }

    getTablesList() {
        return new Promise((resolve, reject) => {
            this.getConnection()
                .then((db) => {
                    const names = [...db.objectStoreNames]
                    resolve(names)
                })
        })
    }

    getDBSize() {
        return new Promise((resolve, reject) => {
            this.getAllTablesSizes()
                .then(
                    res => resolve(Object.values(res)
                        .reduce((collector, i) => collector + i, 0)),
                )
        })
    }

    getConnection() {
        if (this.DBConnection !== null) return Promise.resolve(this.DBConnection)

        return this.openDB()
    }

    openDB() {
        return new Promise((resolve, reject) => {
            openDB(this.DBName, this.DBVersion,
                {
                    upgrade: this.upgradeAgent,
                    blocked: this.blockedAgent,
                    blocking: this.blockingAgent,
                })
                .then((res) => {
                    this.DBConnection = res
                    resolve(res)
                })
        })
    }

    getTransaction(name, type = false) {
        return new Promise((resolve, reject) => {
            this.getConnection()
                .then((db) => {
                    resolve(db.transaction(name, (type ? "readwrite" : "readonly")))
                })
        })
    }

    getAllTablesSizes() {
        return new Promise(async (resolve, reject) => {
            const tables = await this.getTablesList()
            const sizes = await Promise.all(tables.map(r => new ObjectStoreTool(this, r).getSize()))

            const r = {}
            for (let i = 0; i < tables.length; i++) {
                r[tables[i]] = sizes[i]
            }

            resolve(r)
        })
    }

    OSTool(name) {
        return new ObjectStoreTool(this, name)
    }
}
