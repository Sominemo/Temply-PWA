/* eslint-disable consistent-return */
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

    static success(registration, callback) {
        if (App.debug) Report.write("SW Success")

        if (!navigator.serviceWorker.controller) {
            return
        }

        let preventDevToolsReloadLoop
        navigator.serviceWorker.addEventListener("controllerchange", (event) => {
            if (preventDevToolsReloadLoop) return
            preventDevToolsReloadLoop = true
            Report.write("Ready to reload")
        })

        SW.newOne(registration, () => {
            SW.newSWEvent(registration)
        })
    }

    static newOne(registration, callback) {
        if (registration.waiting) {
            return callback()
        }

        function listenInstalledStateChange() {
            registration.installing.addEventListener("statechange", (event) => {
                if (event.target.state === "installed") {
                    callback()
                }
            })
        }

        if (registration.installing) {
            return listenInstalledStateChange()
        }

        registration.addEventListener("updatefound", listenInstalledStateChange)
    }

    static newSWEvent(registration) {
        Report.write("New app update found")
    }

    static applyUpdate(registration) {
        if (!registration.waiting) {
            return
        }

        registration.waiting.postMessage("skipWaiting")
    }

    static fail(error) {
        Report.write("SW Error", error)
    }
}
