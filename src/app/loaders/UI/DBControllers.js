import DBUserPresence from "@Core/Services/DBUserPresence"
import { $$ } from "@Core/Services/Language/handler"
import Report from "@Core/Services/report"
import download from "@App/tools/interaction/download"
import HistoryHints from "@Core/Services/HistoryHints"
import TimeManagementStorage from "@App/modules/diary/storage/TimeManagementStorage"
import Prompt from "@Environment/Library/DOM/elements/prompt"
import FileInput from "@Environment/Library/DOM/object/input/fileInput"
import pFileReader from "@Core/Tools/objects/pFileReader"
import Toast from "@Environment/Library/DOM/elements/toast"
import { CoreLoader } from "@Core/Init/CoreLoader"
import TemplyApp from "@App/modules/main/TemplyApp"

CoreLoader.registerTask({
    id: "db-presence",
    presence: "Register DBs",
    task() {
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

        DBUserPresence.registerNewPresence({
            id: "TimeManagement",
            name: $$("@settings/storage/dbs/time_management"),
            description: $$("@settings/storage/dbs/time_management/description"),
            icon: "schedule",
            quota: () => (1024 ** 2) * 5,
            size: async () => {
                const db = TimeManagementStorage.connection
                const res = await db.getDBSize()
                return res
            },
            config: {
                changeable: true,
                min: (1024 ** 2) * 5,
                max: (1024 ** 2) * 10,
                display: true,
            },
            actions: [
                {
                    name: $$("@settings/storage/actions/export"),
                    handler: () => DBUserPresence.get("TimeManagement").functions.find(e => e.name === "export").handler(),
                },
                {
                    name: $$("@settings/storage/actions/import"),
                    handler: () => {
                        const p = Prompt(
                            {
                                title: $$("@settings/storage/actions/import"),
                                text: new FileInput({
                                    async onchange(file) {
                                        const data = JSON.parse(await pFileReader(file))
                                        try {
                                            DBUserPresence.get("TimeManagement").functions.find(e => e.name === "import").handler(data)
                                            Toast.add($$("success"))
                                            p.close()
                                        } catch (e) {
                                            Toast.add($$("failure"))
                                        }
                                    },
                                }),
                            },
                        )
                    },
                },
            ],
            functions: [
                {
                    name: "import",
                    async handler(data) {
                        const subDB = TimeManagementStorage.connection.OSTool("subjects")
                        const schDB = TimeManagementStorage.connection.OSTool("schedule")

                        await subDB.clear()
                        await schDB.clear()
                        await Promise.all(
                            [
                                ...data.subjects.map(sub => subDB.put(sub)),
                                ...data.schedule.map(sub => schDB.put(sub)),
                            ],
                        )
                    },
                },
                {
                    name: "export",
                    async handler() {
                        const db = TimeManagementStorage.connection
                        const sub = await db.OSTool("subjects").getAll()
                        const sch = await db.OSTool("schedule").getAll()

                        download([JSON.stringify(
                            {
                                meta: {
                                    version: 1,
                                    app: { v: TemplyApp.version, tag: "pwa" },
                                },
                                subjects: sub,
                                schedule: sch,
                            },
                        )], "text/plain", "export.json")
                    },
                },
            ],
        })
    },
})
