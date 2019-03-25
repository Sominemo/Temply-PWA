// Temporary simplified way to manage windows w/o OOP and whatever

import DOM from "./DOM/Classes/dom"
import Navigation from "../main/navigation"
import SettingsStorage from "../services/Settings/SettingsStorage"
import FadeOut from "./Animation/Library/Effects/fadeOut"
import FadeIn from "./Animation/Library/Effects/fadeIn"

export default class WindowManager {
    static windows = []

    static futureWindows = []

    static overlays = []

    static helpers = []

    static scaffoldBuild = false

    static controlWin = false

    static controlOver = false

    static controlHelp = false

    static get fullscreen() { return document.webkitFullscreenElement !== null }

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
        new FadeOut({ duration: 200 }).apply(this.controlWin)
            .then(() => {
                this.controlWin.clear(generated)
                new FadeIn({ duration: 200 }).apply(this.controlWin)
            })

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
            pop: () => {
                const i = this.overlays.indexOf(e)
                if (i === -1) return false
                if (e[0] === this.currentOverlay.element) {
                    this.popOverlay()
                    return true
                } this.overlays.splice(i, 1)
                return true
            },
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

    static newHelper() {
        const w = new DOM({
            new: "div",
            class: "s--wm-ahi",
            id: `s--wm-helper-${this.helpers.length}`,

        })

        const generated = w

        this.helpers.push(generated)
        this.controlHelp.render(generated)

        return this.currentHelper
    }

    static generateHelper(e) {
        e = e || undefined
        return ({
            element: e,
            append: p => e.render(p),
            clear: () => { e.clear() },
            replace: (p) => { e.clear(p) },
            pop: () => {
                const i = this.helpers.indexOf(e)
                if (i === -1) return false
                this.helpers.splice(i, 1)
                this.controlHelp.elementParse.native.removeChild(e.elementParse.native)
                return true
            },
        })
    }

    static get currentHelper() {
        const e = this.helpers[this.helpers.length - 1]
        return this.generateHelper(e)
    }

    static get currentOverlay() {
        const e = this.overlays[this.overlays.length - 1]
        return this.generateOverlay(e)
    }

    static popOverlay() {
        this.controlOver.clear()
        this.overlays.pop()
        const e = this.currentOverlay
        if (e.element !== undefined && e.element.elementParse.native !== undefined) {
            this.controlOver.render(e.element)
            if (e.options.transclick) this.OverlayClicks(true)
            else this.OverlayClicks(false)
        } else this.OverContainer(false)
        return e
    }

    static OverContainer(state = true) {
        if (state) {
            this.generalOver.elementParse.native.classList.add("shown")
        } else {
            this.generalOver.elementParse.native.classList.remove("shown")
        }
    }

    static OverlayClicks(state = false) {
        if (state) {
            this.generalOver.elementParse.native.classList.add("transclick")
        } else {
            this.generalOver.elementParse.native.classList.remove("transclick")
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

        const helpers = new DOM({
            new: "div",
            id: "s--wm-helpers",
        })

        const sc = [
            wins,
            overs,
            helpers,
        ]

        this.controlWin = wins
        this.controlOver = oversLimit
        this.generalOver = overs
        this.controlHelp = helpers
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
                }
            })
        })
    }
}
