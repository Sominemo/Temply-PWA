import DBTool from "../../tools/db/DBTool"

export default class TimeManagementStorage {
    static connection = new DBTool("timeManagement", 1, {
        upgrade(db, oldVersion, newVersion, transaction) {
            if (oldVersion === 0) {
                db.createObjectStore("tasks", {
                    keyPath: "key",
                    autoIncrement: true,
                })
                db.createObjectStore("schedule", {
                    keyPath: "key",
                    autoIncrement: true,
                })
            }
        },
    })

    static getTasks(count) {

    }
}
