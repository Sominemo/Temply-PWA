import DBTool from "../../tools/db/DBTool"
import SettingsCheckProvider from "./SettingsCheckProvider"

export default class SettingsStorage {
    static ObjectStoreNames = ["user", "flags"]

    static _dbConnection = null

    static get db() {
        if (this._dbConnection === null) return this._getDBConnection()
        return this._dbConnection
    }

    static _getDBConnection() {
        this._dbConnection = new DBTool("SettingsStorage", 1, (upgrade) => {
            if (upgrade.oldVersion === 0) {
                upgrade.createObjectStore(this.ObjectStoreNames[0], {
                    keyPath: "key",
                })
                upgrade.createObjectStore(this.ObjectStoreNames[1], {
                    keyPath: "key",
                })
            }
        })

        return this._dbConnection
    }

    static async get(setting) {
        if (typeof setting !== "string") throw new Error("Incorrect key")
        const db = await this.db.getObjectStore(this.ObjectStoreNames[0])
        const res = await db.get(setting)
        if (res === undefined) {
            const props = SettingsCheckProvider.get(setting, "user")
            if (typeof props !== "object") return undefined
            if (typeof props.default === "function") return props.default()
            return props.default
        }
        return res.value
    }

    static async set(setting, value) {
        if (typeof setting !== "string") throw new Error("Incorrect key")

        const si = SettingsCheckProvider.check(setting, value, "user")
        const ov = await this.get(setting)
        const db = await this.db.getObjectStore(this.ObjectStoreNames[0], true)
        if (!si[0]) {
            const res = si[1](value, setting, async (v, ou = true) => {
                const ndb = await this.db.getObjectStore(this.ObjectStoreNames[0], true)
                await ndb.put({ key: setting, value: v })
                if (ou) si[3](v, ov, setting, si[2])
            })

            return (!!res)
        }

        await db.put({ key: setting, value })
        si[3](value, ov, setting, si[2])
        return true
    }

    static async getFlag(flag) {
        if (typeof flag !== "string") throw new Error("Incorrect key")
        const db = await this.db.getObjectStore(this.ObjectStoreNames[1])
        const res = await db.get(flag)
        if (res === undefined) {
            const props = SettingsCheckProvider.get(flag, "flags")
            if (typeof props !== "object") return undefined
            if (typeof props.default === "function") return props.default()
            return props.default
        }
        return res.value
    }

    static async getAllFlags() {
        const db = await this.db.getObjectStore(this.ObjectStoreNames[1])
        const res = await db.getAll()
        return res
    }

    static async setFlags(flags) {
        if (typeof flags !== "object") throw new Error("Incorrect data")
        const ova = await this.getAllFlags()
        const db = await this.db.getObjectStore(this.ObjectStoreNames[1], true)
        let gr = true
        Object.keys(flags).forEach(async (key) => {
            const ov = ova.find(e => e.key === key).value
            const si = SettingsCheckProvider.check(key, flags[key], "flags")

            if (!si[0]) {
                si[1](flags[key], key, async (v, ou = true) => {
                    const ndb = await this.db.getObjectStore(this.ObjectStoreNames[1], true)
                    await ndb.put({ key, value: v })

                    if (ou) si[3](v, ov, key, si[2])
                })

                gr = false
                return
            }
            db.put({ key, value: flags[key] })
            si[3](flags[key], ov, key, si[2])
        })
        return gr
    }

    static addListener = SettingsCheckProvider.addListener.bind(SettingsCheckProvider)

    static removeListener = SettingsCheckProvider.removeListener.bind(SettingsCheckProvider)
}
