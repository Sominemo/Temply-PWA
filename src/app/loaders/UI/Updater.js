import SW from "@Core/Services/SW"
import updatePopup from "@App/tools/interaction/updatePopup"
import WindowManager from "@Core/Services/SimpleWindowManager"
import { Align, Padding } from "@Environment/Library/DOM/style"
import { Title } from "@Environment/Library/DOM/object"
import { $$ } from "@Core/Services/Language/handler"
import SettingsStorage from "@Core/Services/Settings/SettingsStorage"
import Toast from "@Environment/Library/DOM/elements/toast"
import TemplyApp from "@App/modules/main/TemplyApp"
import { Popup } from "@Environment/Library/DOM/elements"
import { CoreLoader } from "@Core/Init/CoreLoader"

async function userPrompt(after = false) {
    async function loadPopup() {
        const r = await updatePopup(
            {
                update: true,
                online: (after ? false : await TemplyApp.lastChangelog()),
            },
        )

        return r
    }

    async function displayPopup(p) {
        const o = WindowManager.newOverlay()
        o.append(new Popup([
            new Align(new Title((after ? $$("@settings/updates/installed") : $$("@settings/updates/ready")), 2), ["center", "row"]),
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

CoreLoader.registerTask({
    id: "sw-updater",
    presence: "Register update handler",
    task() {
        SW.userPrompt = userPrompt
    },
})
