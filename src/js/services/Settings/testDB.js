import SettingsStorage from "./SettingsStorage"
import Prompt from "../../ui/DOM/Library/elements/prompt"
import { $$ } from "../Language/handler"

export default async function testDB() {
    let test = true
    try {
        test = await SettingsStorage.setFlag("idb_compatible_test", true)
    } catch (e) {
        test = false
    }
    if (!test) {
        Prompt({
            title: $$("@recovery_mode/idb_fail/warning"),
            text: $$("@recovery_mode/idb_fail/description"),
            buttons: [
                {
                    content: $$("@recovery_mode/idb_fail/dl_ff"),
                    type: ["light"],
                    handler() {
                        window.location.href = "https://www.mozilla.org/firefox/new/"
                    },
                },
                {
                    content: $$("@recovery_mode/idb_fail/dl_chrome"),
                    handler() {
                        window.location.href = "https://www.google.com/chrome/"
                    },
                },
            ],
        })
    }
}
