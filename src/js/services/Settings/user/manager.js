import SettingsLayout from "./layout"


export default class SettingsLayoutManager {
    static _layout = false

    static applyLayout(l) {
        if (!(l instanceof SettingsLayout)) throw new TypeError("Only Settings Layout can be applied")

        this._layout = l
    }

    static get layout() {
        return this._layout
    }
}
