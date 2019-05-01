import DBTool from "../tools/db/DBTool"

const HistoryHintsConfig = [
    {
        name: "subjects",
        max: 10,
    },
    {
        name: "lesson-locations",
        max: 10,
    },
]

export default class HistoryHints {
    static connection = new DBTool("userActvityHistory", 1, {
        upgrade(db, oldVersion, newVersion, transaction) {
            if (oldVersion === 0) {
                HistoryHintsConfig.forEach((e) => {
                    db.createObjectStore(e.name, {
                        keyPath: "key",
                        autoIncrement: true,
                    })
                })
            }
        },
    })

    static async clear(auto) {
        const tasks = HistoryHintsConfig.map(e => this.clearByName(e.name, (auto ? 0.5 : null)))
        const r = await Promise.all(tasks)
        return r
    }

    static async clearByName(name, percent = null) {
        const os = this.connection.OSTool(name)
        if (percent !== null) {
            await os.clearPercent(percent)
        } else {
            await os.clear()
        }
        return true
    }

    static async getHints(name) {
        const os = this.connection.OSTool(name)
        const r = (await os.getAll()).map(e => e.data).reverse()
        return r
    }

    static async saveHint(name, data) {
        const os = this.connection.OSTool(name)
        const currentConfig = HistoryHintsConfig.find(e => e.name === name)

        const dub = (await os.getByCount(currentConfig.max))
            .find(e => e.data === data)
        if (dub) os.delete(dub.key)

        os.add({ data })
        let recCount = await os.count()

        async function iter(cursor) {
            if (!cursor) return
            cursor.delete()
            await cursor.continue()
            recCount--
            if (recCount > currentConfig.max) iter(cursor)
        }

        if (recCount > currentConfig.max) {
            const cur = await os.createCursor(null, "next", true)
            iter(cur)
        }

        return true
    }
}
