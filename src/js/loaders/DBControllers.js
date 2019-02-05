import DBUserPresence from "../services/DBUserPresence"
import DBTool from "../tools/db/DBTool"

DBUserPresence.registerNewPresence({
    id: "LogData",
    name: "Logs",
    description: "Keeps general data about app unctionality to help with debug if something happens unexpectly",
    icon: "description",
    quota: () => (1024 ** 2) * 100,
    size: async () => {
        const db = new DBTool("LogData", 1)
        const res = await db.getDBSize()
        return res
    },
    config: {
        changable: true,
        min: (1024 ** 2) * 10,
        max: (1024 ** 2) * 300,
        display: true,
    },
    actions: [
        {
            name: "Clear",
            handler: () => new Promise((resolve, reject) => {
                const db = new DBTool("LogData", 1)
                db.getObjectStore("console-output", true)
                    .then(a => a.clear())
                    .then(() => resolve())
                    .catch(() => reject())
            }),
        },
    ],
})
