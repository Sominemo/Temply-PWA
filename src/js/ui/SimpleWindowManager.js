// Temporary simplified way to manage windows w/o OOP and whatever

import DOM from "./DOM/Classes/dom"
import Navigation from "../main/navigation"
import SettingsStorage from "../services/Settings/SettingsStorage"

export default class WindowManager {
    static windows = []

    static futureWindows = []

    static overlays = []

    static scaffoldBuild = false

    static controlWin = false

    static controlOver = false

    static fullscreen = false

    static newLayer() {
        return Error("Only Windows and Overlays in this implementation")
    }

    static newWindow(h) {
        const w = new DOM({
            new: "div",
            class: "s--wm-awi",
            id: `s--wm-win-${this.windows.length}`,

        })

        const generated = w
        this.windows.push(generated)
        this.controlWin.clear(generated)

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
            append: p => e.render(p),
            clear: () => { e.clear() },
            replace: (p) => { e.clear(p) },
        })
    }

    static generateOverlay(e) {
        e = e || [undefined, {}]
        return ({
            element: e[0],
            append: p => e[0].render(p),
            clear: () => { e[0].clear() },
            replace: (p) => { e[0].clear(p) },
            options: e[1],
        })
    }

    static newOverlay(options = {}) {
        const w = new DOM({
            new: "div",
            class: "s--wm-aoi",
            id: `s--wm-over-${this.overlays.length}`,

        })

        const generated = w

        this.overlays.push([generated, options])

        this.controlOver.clear(generated)

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
        this.controlOver.clear()
        this.overlays.pop()
        const e = this.currentOverlay
        if (e !== undefined && e.native !== undefined) {
            this.controlOver.render(e)
            if (e.options.transclick) this.OverlayClicks(true)
            else this.OverlayClicks(false)
        } else this.OverContainer(false)
        return e
    }

    static OverContainer(state = true) {
        if (state) {
            this.generalOver.native.classList.add("shown")
        } else {
            this.generalOver.native.classList.remove("shown")
        }
    }

    static OverlayClicks(state = false) {
        if (state) {
            this.generalOver.native.classList.add("transclick")
        } else {
            this.generalOver.native.classList.remove("transclick")
        }
    }

    static closeAllOverlays() {
        this.controlOver.clear()
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
        const we = this.currentWindow
        if (we === undefined || we.element === undefined) return Navigation.go(a, b)
        this.controlWin.clear(we.element)

        return [this.generateWindow(last), this.currentWindow]
    }

    static navForward(a, b) {
        const last = this.futureWindows.pop()

        this.windows.push(last)

        const we = this.currentWindow
        if (we === undefined || we.element === undefined) return Navigation.go(a, b)
        this.controlWin.clear(we.element)

        return [this.generateWindow(last), this.currentWindow]
    }

    static async EnableFullScreenExperience() {
        if (!("webkitRequestFullscreen" in document.documentElement)
        || !await SettingsStorage.getFlag("fullscreen_on_tap")) return

        window.addEventListener("load", () => {
            document.documentElement.addEventListener("touchend", () => {
                if (!this.fullscreen) {
                    document.documentElement.webkitRequestFullscreen()
                    this.fullscreen = !this.fullscreen
                }
            })
        })
    }
}
