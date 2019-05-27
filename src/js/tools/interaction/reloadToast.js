import Toast from "../../ui/DOM/Library/elements/toast"
import { $$ } from "../../services/Language/handler"

export default function reloadToast() {
    Toast.add($$("@settings/restart_to_apply"), 0, {
        buttons: [
            {
                content: $$("@settings/actions/restart"),
                handler() {
                    window.location.reload()
                },
            },
        ],
    })
}
