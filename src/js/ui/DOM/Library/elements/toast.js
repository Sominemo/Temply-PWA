import WindowManager from "../../../SimpleWindowManager"
import ToastElement from "./toastElement"

export default class Toast {
    static showing = false

    static buffer = []

    static add(content, duration = 3000, { buttons = [], click = false } = {}) {
        this.buffer.push([content, { buttons, click, duration }])
        if (!this.showing) this.next()
    }

    static display(p) {
        if (!p) return false
        const h = WindowManager.newHelper()
        const index = this.buffer.indexOf(p)
        this.showing = true
        if (index !== -1) {
            this.buffer.splice(index, 1)
        }
        const oFunc = h.pop
        h.pop = (...a) => {
            this.showing = false
            this.next()

            return oFunc(...a)
        }

        const toast = new ToastElement(...p, h)

        h.append(toast)
        return true
    }

    static next() {
        this.display(this.buffer[0])
        return true
    }
}
