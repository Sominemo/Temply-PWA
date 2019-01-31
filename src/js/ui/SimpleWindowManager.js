// Temporary simplified way to manage windows w/o OOP and whatever

import DOM from "./dom/dom"
import Navigation from "../main/navigation"

export default class WindowManager {
    static windows = []

    static futureWindows = []

    static overlays = []

    static scaffoldBuild = false

    static controlWin = false

    static controlOver = false

    static newLayer() {
        return Error("Only Windows and Overlays in this implementation")
    }

    static newWindow(h) {
        const w = new DOM({
            new: "div",
            class: "s--wm-awi",
            id: `s--wm-win-${this.windows.length}`,

        })

        const generated = w.element
        this.windows.push(generated)
        this.controlWin.elementView.innerHTML = ""
        this.controlWin.elementView.appendChild(generated)

        if (typeof h === "function") h(w)
        return this.currentWindow
    }

    static get currentWindow() {
        const e = this.windows[this.windows.length - 1]
        return this.generateWindow(e)
    }

    static generateWindow(e) {
        return ({
            element: e,
            append: p => e.appendChild(p.element),
            clear: () => { e.innerHTML = "" },
            replace: (p) => { e.innerHTML = ""; e.appendChild(p.element) },
        })
    }

    static generateOverlay(e) {
        e = e || [undefined, {}]
        return ({
            element: e[0],
            append: p => e[0].appendChild(p.element),
            clear: () => { e[0].innerHTML = "" },
            replace: (p) => { e[0].innerHTML = ""; e[0].appendChild(p.element) },
            options: e[1],
        })
    }

    static newOverlay(options = {}) {
        const w = new DOM({
            new: "div",
            class: "s--wm-aoi",
            id: `s--wm-over-${this.overlays.length}`,

        })

        const generated = w.element

        this.overlays.push([generated, options])

        this.controlOver.elementView.innerHTML = ""

        this.controlOver.elementView.appendChild(generated)

        this.OverContainer(true)

        if (options.transclick) this.OverlayClicks(true)
        else this.OverlayClicks(false)

        return this.currentOverlay
    }

    static get currentOverlay() {
        const e = this.overlays[this.overlays.length - 1]
        return this.generateOverlay(e)
    }

    static popOverlay() {
        this.controlOver.elementView.innerHTML = ""
        this.overlays.pop()
        const e = this.currentOverlay
        if (e.element !== undefined) {
            this.controlOver.elementView.appendChild(e.element)
            if (e.options.transclick) this.OverlayClicks(true)
            else this.OverlayClicks(false)
        } else this.OverContainer(false)
        return e
    }

    static OverContainer(state = true) {
        if (state) {
            this.generalOver.elementView.classList.add("shown")
        } else {
            this.generalOver.elementView.classList.remove("shown")
        }
    }

    static OverlayClicks(state = false) {
        if (state) {
            this.generalOver.elementView.classList.add("transclick")
        } else {
            this.generalOver.elementView.classList.remove("transclick")
        }
    }

    static closeAllOverlays() {
        this.controlOver.elementView.innerHTML = ""
        this.overlays = []
        this.OverContainer(false)
        this.OverlayClicks(false)
    }

    static get Scaffold() {
        const wins = new DOM({
            new: "div",
            id: "s--wm-windows",
        })

        const oversLimit = new DOM({
            new: "div",
            id: "s--wm-overlays-container",
        })

        const overs = new DOM({
            new: "div",
            id: "s--wm-overlays",
            content: oversLimit,
        })

        const sc = [
            wins,
            overs,
        ]

        this.controlWin = wins
        this.controlOver = oversLimit
        this.generalOver = overs
        this.scaffoldBuild = sc

        return sc
    }

    static navBack(a, b) {
        const last = this.windows.pop()

        this.futureWindows.push(last)
        const we = this.currentWindow.element
        if (we === undefined) return Navigation.go(a, b)
        this.controlWin.elementView.innerHTML = ""
        this.controlWin.elementView.appendChild(we)

        return [this.generateWindow(last), this.currentWindow]
    }

    static navForward(a, b) {
        const last = this.futureWindows.pop()

        this.windows.push(last)

        const we = this.currentWindow.element
        if (we === undefined) return Navigation.go(a, b)
        this.controlWin.elementView.innerHTML = ""
        this.controlWin.elementView.appendChild(we)

        return [this.generateWindow(last), this.currentWindow]
    }
}
