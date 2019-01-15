import App from "./app"
import Report from "./report"

export default class SW {
    static register() {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("./sw.js", { scope: "/" })
                .then(this.success)
                .catch(this.fail)
        }
    }

    static success() {
        if (App.debug) Report.write("SW Success")
    }

    static fail(error) {
        Report.write("SW Error", error)
    }
}
