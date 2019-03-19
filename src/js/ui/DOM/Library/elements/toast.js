import WindowManager from "../../../SimpleWindowManager"
import ToastElement from "./toastElement"

export default class Toast {
    static buffer = []

    static add(content, duration = 3000, { buttons = [], click = false } = {}) {
        this.buffer.push([content, { buttons, click, duration }])
        if (this.buffer.length === 1) this.next()
    }

    static display(p) {
        if (!p) return false
        const h = WindowManager.newHelper()
        const oFunc = h.pop
        h.pop = (...a) => {
            const index = this.buffer.indexOf(p)
            if (index !== -1) {
                this.buffer.splice(index, 1)
            }
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
