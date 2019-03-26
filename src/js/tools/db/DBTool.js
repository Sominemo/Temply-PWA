// SOURCE: https://gist.github.com/tralves/9e5de2bd9f582007a52708d7d4209865

import { openDB, deleteDB } from "idb"

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

    getTableSize(name) {
        const self = this
        self.size[name] = 0
        return new Promise((resolve, reject) => {
            this.getObjectStore(name)
                .then(os => os.openCursor())
                .then(
                    function iter(cursor) {
                        if (!cursor) return resolve(self.size[name])
                        self.size[name] += JSON.stringify(cursor.value).length

                        Object.keys(cursor.value).forEach((e) => {
                            if (Object.prototype.hasOwnProperty.call(cursor.value, e)
                                && cursor.value[e] instanceof Blob) {
                                self.size[name] += cursor.value[e]
                            }
                        })

                        return cursor.continue().then(iter)
                    },
                )
        })
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
                    () => resolve(Object.values(this.size)
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
        return new Promise((resolve, reject) => {
            this.getTablesList().then((tables) => {
                Promise.all(tables.map(r => this.getTableSize(r)))
                    .then(() => resolve(this.size))
            })
        })
    }
}
