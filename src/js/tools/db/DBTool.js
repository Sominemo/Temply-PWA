// IDEA: https://gist.github.com/tralves/9e5de2bd9f582007a52708d7d4209865

import idb from "idb"

export default class DBTool {
    DBName = null

    DBVersion = 0

    DBConnection = null

    upgradeAgent = null

    size = Object.create(null)

    constructor(db, version, upgradeAgent = () => { }) {
        if (typeof db !== "string"
            || typeof version !== "number"
            || typeof upgradeAgent !== "function") throw new Error("Incorrect DB params")

        this.DBName = db
        this.DBVersion = version
        this.upgradeAgent = upgradeAgent
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
        if (this.DBConnection !== null) return new Promise(resolve => resolve(this.DBConnection))

        return this.openDB()
    }

    openDB() {
        return new Promise((resolve, reject) => {
            idb.open(this.DBName, this.version, this.upgradeAgent)
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
