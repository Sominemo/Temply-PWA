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
        const r = await this.connection.getTableSize(this.name)
        return r
    }

    async createCursor(...a) {
        const r = await this.connection.createCursor(this.name, ...a)
        return r
    }

    async getItemsByCount(...a) {
        const r = await this.connection.getItemsByCount(this.name, ...a)
        return r
    }

    async getItemByKey(...a) {
        const r = await this.connection.getItemByKey(this.name, ...a)
        return r
    }
}
