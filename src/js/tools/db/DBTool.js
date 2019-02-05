// IDEA: https://gist.github.com/tralves/9e5de2bd9f582007a52708d7d4209865

import idb from "idb"

export default class dbTool {
    DBName = null

    DBVersion = 0

    DBConnection = null

    size = Object.create(null)

    constructor(db, version) {
        if (typeof db !== "string") throw new Error("Incorrect DB name")

        this.DBName = db
        this.DBVersion = version
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

    getObjectStore(name) {
        return new Promise((resolve, reject) => {
            this.getTransaction(name).then(e => e.objectStore(name))
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
            idb.open(this.DBName, this.version)
                .then((res) => {
                    this.DBConnection = res
                    resolve(res)
                })
        })
    }

    getTransaction(name) {
        return new Promise((resolve, reject) => {
            this.getConnection()
                .then((db) => {
                    resolve(db.transaction(name, "readonly"))
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
