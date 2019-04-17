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

    static generateIDBRange(params) {
        try {
            if (params instanceof IDBKeyRange) return params
            if (Array.isArray(params)) {
                if (params.length === 0) return null
                if (params.length === 1) {
                    if (Array.isArray(params[0])) return IDBKeyRange.lowerBound(params[0][0], true)
                    return IDBKeyRange.lowerBound(params[0])
                }
                if (params.length === 2) {
                    if (params[0] === null) {
                        if (Array.isArray(params[1])) {
                            return IDBKeyRange.upperBound(params[1][0], true)
                        }
                        return IDBKeyRange.upperBound(params[0])
                    }
                    let first = params[0]
                    let second = params[1]
                    let firstStrict = false
                    let secondStrict = false

                    if (Array.isArray(first)) {
                        [first] = first
                        firstStrict = true
                    }

                    if (Array.isArray(second)) {
                        [second] = second
                        secondStrict = true
                    }

                    return IDBKeyRange.bound(first, second, firstStrict, secondStrict)
                }
            }
        } catch (e) {
            return null
        }

        return null
    }

    async createCursor(store, range, direction) {
        const r = await (await this.getObjectStore(store))
            .openCursor(this.constructor.generateIDBRange(range), direction)
        return r
    }

    async getItemsByCount(store, count = 1, direction = "next", range = null) {
        let cursor = await this.createCursor(
            store,
            range,
            direction,
        )

        let i = 0
        const r = []

        while (cursor && i < count) {
            i++
            r.push(cursor.value)
            // eslint-disable-next-line no-await-in-loop
            cursor = await cursor.continue()
        }

        return r
    }

    async getItemByKey(store, key) {
        const r = await (await this.getObjectStore(store)).get(key)

        return r
    }
}
