export default class LoadState {
    static _state = false;

    static get is() {
        return this._state
    }

    static set is(a) {
        if (a === true) this._state = true
    }
}
