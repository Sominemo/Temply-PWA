import DBUserPresence from "../services/DBUserPresence"
import Report from "../main/report"
import download from "../tools/interaction/download"
import { $$ } from "../services/Language/handler"
import HistoryHints from "../services/HistoryHints"

DBUserPresence.registerNewPresence({
    id: "LogData",
    name: $$("@settings/storage/dbs/logs"),
    description: $$("@settings/storage/dbs/logs/description"),
    icon: "description",
    quota: () => (1024 ** 2) * 15,
    size: async () => {
        const db = Report.DBConnection
        const res = await db.getDBSize()
        return res
    },
    config: {
        changeable: true,
        min: (1024 ** 2) * 10,
        max: (1024 ** 2) * 300,
        display: true,
    },
    actions: [
        {
            name: $$("@settings/storage/actions/clear"),
            handler: () => DBUserPresence.get("LogData").functions.find(e => e.name === "clear").handler(),
        },
        {
            name: $$("@settings/storage/actions/export"),
            handler: () => DBUserPresence.get("LogData").functions.find(e => e.name === "export").handler(),
        },
    ],
    functions: [
        {
            name: "clear",
            handler: () => new Promise((resolve, reject) => {
                const db = Report.DBConnection
                db.getObjectStore("console-output", true)
                    .then(a => a.clear())
                    .then(() => resolve())
                    .catch(() => reject())
            }),
        },
        {
            name: "export",
            async handler() {
                const db = JSON.stringify(await Report.allLog())

                download([db], "text/plain", "app-log.json")
            },
        },
        {
            name: "auto-clean",
            async handler() {
                const db = Report.DBConnection.OSTool("console-output")
                await db.clearPercent(0.5)
            },
        },
    ],
})

DBUserPresence.registerNewPresence({
    id: "UserInteractionData",
    name: $$("@settings/storage/dbs/interaction_data"),
    description: $$("@settings/storage/dbs/interaction_data/description"),
    icon: "fingerprint",
    quota: () => (1024 ** 2) * 5,
    size: async () => {
        const db = HistoryHints.connection
        const res = await db.getDBSize()
        return res
    },
    config: {
        changeable: true,
        min: (1024 ** 2) * 1,
        max: (1024 ** 2) * 5,
        display: true,
    },
    actions: [
        {
            name: $$("@settings/storage/actions/clear"),
            handler: () => DBUserPresence.get("UserInteractionData").functions.find(e => e.name === "clear").handler(),
        },
    ],
    functions: [
        {
            name: "clear",
            async handler() {
                await HistoryHints.clear()
            },
        },
        {
            name: "auto-clean",
            async handler() {
                await HistoryHints.clear(true)
            },
        },
    ],
})

Report.write("DB Presence registered")
