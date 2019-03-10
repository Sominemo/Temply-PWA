import updatePopup from "../services/Settings/layouts/updatePopup"
import { Title } from "../ui/DOM/Library/object"
import WindowManager from "../ui/SimpleWindowManager"
import { WindowContainer } from "../ui/DOM/Library/buildBlock"
import Popup from "../ui/DOM/Library/elements/popup"
import { Algin } from "../ui/DOM/Library/style"
import DOM from "../ui/DOM/Classes/dom"
import { MDRadio } from "../ui/DOM/Library/object/input"
import { $$ } from "../services/Language/handler"
import RadioLabel from "../ui/DOM/Library/object/input/radioLabel"
import { Card } from "../ui/DOM/Library/object/card"
import SettingsStorage from "../services/Settings/SettingsStorage"

export default class TestField {
    static async Init() {
        const testEnabled = !!await SettingsStorage.getFlag("test_field_enabled")
        if (!testEnabled) throw new Error("Test Field is disabled")

        const w = new WindowContainer()
        WindowManager.newWindow().append(w)

        w.render(new Title("Test Field"))

        w.render(new Card(new RadioLabel([
            { handler: console.log, selected: true, content: "lol" },
            { handler: console.log, content: "lol1" },
            { handler: console.log, content: "lol2" },
        ])))


        const o = WindowManager.newOverlay()
        o.append(new Popup([
            new Algin(new Title($$("@settings/updates/ready"), 2), ["center", "row"]),
            ...await updatePopup({ update: true }),
        ], { pop: o.pop, fullWidth: true }))
    }
}
