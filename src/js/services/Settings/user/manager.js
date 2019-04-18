import SettingsLayout from "./layout"
import Report from "../../../main/report"


export default class SettingsLayoutManager {
    static _layout = false

    static applyLayout(l) {
        if (!(l instanceof SettingsLayout)) throw new TypeError("Only Settings Layout can be applied")

        this._layout = l
        Report.write("Settings layout applied")
    }

    static get layout() {
        return this._layout
    }
}
