import DBTool from "./DBTool"


// TODO: Convert to independent object
export default class ObjectStoreTool {
    connection = null

    name = null

    constructor(connection, name) {
        if (!(connection instanceof DBTool)) throw new TypeError("DB Tool needed")
        if (typeof name !== "string") throw new TypeError("Incorrect ObjectStore name")

        this.connection = connection
        this.name = name

        return new Proxy(this, {
            get(target, propKey) {
                if (!(propKey in target)) {
                    return async (...params) => {
                        const os = await target.getOS(true)
                        return os[propKey](...params)
                    }
                }
                return target[propKey]
            },
        })
    }

    get parent() {
        return this.connection
    }

    get name() {
        return this.name
    }

    async getOS(type = false) {
        const r = await this.connection.getObjectStore(this.name, type)
        return r
    }

    async getSize() {
        const self = this
        self.size = 0
        return new Promise((resolve, reject) => {
            this.getOS()
                .then(os => os.openCursor())
                .then(
                    function iter(cursor) {
                        if (!cursor) return resolve(self.size)
                        self.size += JSON.stringify(cursor.value).length

                        Object.keys(cursor.value).forEach((e) => {
                            if (Object.prototype.hasOwnProperty.call(cursor.value, e)
                                && cursor.value[e] instanceof Blob) {
                                self.size += cursor.value[e]
                            }
                        })

                        return cursor.continue().then(iter)
                    },
                )
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

    async createCursor(range = null, direction = "next", type = false) {
        const r = await (await this.getOS(type))
            .openCursor(this.constructor.generateIDBRange(range), direction)
        return r
    }

    async getByCount(count = 1, direction = "next", range = null) {
        let cursor = await this.createCursor(
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

    async clearPercent(percent = 1, direction = "next", range = null) {
        if (typeof percent !== "number" || percent > 1 || percent < 0) return false
        let allSize = 0
        const thisAllSize = await this.getSize()
        return new Promise(async (resolve) => {
            const os = this
            const cur = await os.createCursor(range, direction, true)
            function iter(cursor) {
                let size = 0
                if (!cursor || (allSize / thisAllSize) > percent) return resolve(allSize)
                size += JSON.stringify(cursor.value).length

                Object.keys(cursor.value).forEach((e) => {
                    if (Object.prototype.hasOwnProperty.call(cursor.value, e)
                        && cursor.value[e] instanceof Blob) {
                        size += cursor.value[e]
                    }
                })

                allSize += size

                cursor.delete()

                return cursor.continue().then(iter)
            }
            iter(cur)
        })
    }
}
