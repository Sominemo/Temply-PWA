import idb from "idb"
import App from "./app"

class ReportDB {
    constructor() {
        idb.open("LogData", 1)
    }
}

export default class Report {
    static trace() {
        let stack = new Error().stack || ""
        stack = stack.split("\n").map(line => line.trim())
        return stack.splice(stack[0] === "Error" ? 2 : 1)
    }

    static write(...log) {
        if (App.debug) {
            const lines = this.trace()
            console.log(...log)
            console.groupCollapsed("Trace")
            lines.forEach((line) => {
                console.log(line)
            })
            console.groupEnd()
        }
    }

    static saveToDB(...log) {

    }
}
