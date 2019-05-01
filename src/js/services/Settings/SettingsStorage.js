import DBTool from "../../tools/db/DBTool"
import SettingsCheckProvider from "./SettingsCheckProvider"
import Report from "../../main/report"

export default class SettingsStorage {
    static ObjectStoreNames = ["user", "flags"]

    static _dbConnection = null

    static get db() {
        if (this._dbConnection === null) return this._getDBConnection()
        return this._dbConnection
    }

    static _getDBConnection() {
        const self = this
        this._dbConnection = new DBTool("SettingsStorage", 1, {
            upgrade(db, oldVersion, newVersion, transaction) {
                console.log(db)
                if (oldVersion === 0) {
                    db.createObjectStore(self.ObjectStoreNames[0], {
                        keyPath: "key",
                    })
                    db.createObjectStore(self.ObjectStoreNames[1], {
                        keyPath: "key",
                    })
                }
            },
        })

        return this._dbConnection
    }

    static async get(setting, integrityCheck = false) {
        try {
            if (typeof setting !== "string") throw new Error("Incorrect key")
            const db = this.db.OSTool(this.ObjectStoreNames[0])
            const res = (await db.get(setting))
            if (res === undefined) {
                let props = SettingsCheckProvider.get(setting, "user")
                if (typeof props !== "object") return undefined
                props = props[props.length - 1]
                if (typeof props.default === "function") return props.default()
                return props.default
            }
            const resv = res.value
            if (integrityCheck) {
                const si = SettingsCheckProvider.check(setting, resv, "user")
                if (!si[0]) {
                    let repl = resv
                    await si[1](resv, setting, async (v, ou = true) => {
                        await db.put({ key: setting, value: v })
                        repl = v
                        if (ou) si[3](v, resv, setting, si[2])
                    })

                    return repl
                }
            }

            return resv
        } catch (e) {
            Report.write("Failed getting settings", e)
            return undefined
        }
    }

    static async set(setting, value) {
        try {
            if (typeof setting !== "string") throw new Error("Incorrect key")

            const si = SettingsCheckProvider.check(setting, value, "user")
            const ov = await this.get(setting)
            const db = this.db.OSTool(this.ObjectStoreNames[0])
            if (!si[0]) {
                const res = await si[1](value, setting, async (v, ou = true) => {
                    await db.put({ key: setting, value: v })
                    if (ou) si[3](v, ov, setting, si[2])
                })

                return (!!res)
            }

            await db.put({ key: setting, value })
            si[3](value, ov, setting, si[2])
            return true
        } catch (e) {
            Report.write("Failed saving settings", e)
            return false
        }
    }

    static async getFlag(flag, integrityCheck = false) {
        try {
            if (typeof flag !== "string") throw new Error("Incorrect key")
            const db = this.db.OSTool(this.ObjectStoreNames[1])
            const res = (await db.get(flag))
            if (res === undefined) {
                let props = SettingsCheckProvider.get(flag, "flags")
                if (typeof props !== "object") return undefined
                props = props[props.length - 1]
                if (typeof props.default === "function") return props.default()
                return props.default
            }
            const resv = res.value
            if (integrityCheck) {
                const si = SettingsCheckProvider.check(flag, resv, "flags")
                if (!si[0]) {
                    let repl = resv
                    await si[1](resv, flag, async (v, ou = true) => {
                        await db.put({ key: flag, value: v })
                        repl = v
                        if (ou) si[3](v, resv, flag, si[2])
                    })

                    return repl
                }
            }

            return resv
        } catch (e) {
            Report.write("Failed getting flag", e)
            return undefined
        }
    }

    static async getAllFlags() {
        try {
            const db = this.db.OSTool(this.ObjectStoreNames[1])
            const res = await db.getAll()
            return res
        } catch (e) {
            Report.write("Failed getting all flags", e)
            return undefined
        }
    }

    static async setFlag(flag, value) {
        try {
            if (typeof flag !== "string") throw new Error("Incorrect flag name")

            const si = SettingsCheckProvider.check(flag, value, "flags")
            const ov = await this.getFlag(flag)
            const db = this.db.OSTool(this.ObjectStoreNames[1])
            if (!si[0]) {
                const res = si[1](value, flag, async (v, ou = true) => {
                    await db.put({ key: flag, value: v })
                    if (ou) si[3](v, ov, flag, si[2])
                })

                return (!!res)
            }

            await db.put({ key: flag, value })
            si[3](value, ov, flag, si[2])
            return true
        } catch (e) {
            Report.write("Failed setting flag", e)
            return false
        }
    }

    static async reset(type) {
        if (typeof type !== "string"
            || !this.ObjectStoreNames.includes(type)) throw new TypeError("Undefined section name")

        const o = this.db.OSTool(type)
        const r = await o.clear()
        return r
    }

    static addListener = SettingsCheckProvider.addListener.bind(SettingsCheckProvider)

    static removeListener = SettingsCheckProvider.removeListener.bind(SettingsCheckProvider)
}
