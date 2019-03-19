/* eslint-disable consistent-return */
import App from "./app"
import Report from "./report"
import Toast from "../ui/DOM/Library/elements/toast"
import { Padding, Algin } from "../ui/DOM/Library/style"
import WindowManager from "../ui/SimpleWindowManager"
import { Popup } from "../ui/DOM/Library/elements"
import { Title } from "../ui/DOM/Library/object"
import { $$ } from "../services/Language/handler"
import updatePopup from "../services/Settings/layouts/updatePopup"
import SettingsStorage from "../services/Settings/SettingsStorage"

export default class SW {
    static updatePending = false

    static register() {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("./sw.js", { scope: "/" })
                .then(this.success)
                .catch(this.fail)
        }
    }

    static success(registration, callback) {
        if (App.debug) Report.write("SW Success")
        SW.plannedPromptCheck()

        if (!navigator.serviceWorker.controller) {
            return
        }

        let preventDevToolsReloadLoop
        navigator.serviceWorker.addEventListener("controllerchange", (event) => {
            if (preventDevToolsReloadLoop) return
            preventDevToolsReloadLoop = true
            Report.write("Ready to reload")
            SW.onUpdate()
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

    static async onUpdate() {
        this.updatePending = true

        const gottaDelay = await SettingsStorage.get("user_update_prompt_later")
        if (gottaDelay) {
            SettingsStorage.set("update_prompt_planned", true)
            return
        }

        this.userPrompt()
    }

    static async plannedPromptCheck() {
        const gottaFire = await SettingsStorage.get("update_prompt_planned")
        if (gottaFire) {
            SettingsStorage.set("update_prompt_planned", false)
            this.userPrompt(true)
        }
    }

    static async userPrompt(after = false) {
        async function loadPopup() {
            const r = await updatePopup(
                {
                    update: true,
                    online: (after ? false : await App.lastChangelog()),
                },
            )

            return r
        }

        async function displayPopup(p) {
            const o = WindowManager.newOverlay()
            o.append(new Popup([
                new Algin(new Title((after ? $$("@settings/updates/installed") : $$("@settings/updates/ready")), 2), ["center", "row"]),
                ...p,
            ], { control: o, fullWidth: true }))
        }

        const setting = await SettingsStorage.get("user_update_prompt")

        if (setting === "silent") {
            // Do nothing
        } else if (setting === "popup") {
            displayPopup(await loadPopup())
        } else {
            const p = await loadPopup()
            Toast.add(new Padding((after ? $$("@settings/updates/installed") : $$("@settings/updates/ready")), 15), 5000, {
                buttons: [
                    {
                        async handler() {
                            displayPopup(p)
                        },
                        content: $$("@settings/updates/tell_more"),
                    },
                ],
            })
        }
    }
}
