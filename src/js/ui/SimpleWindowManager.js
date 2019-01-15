import DOM from "./dom/dom"

export default class WindowManager {
    static windows = []

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

        this.windows.push(w)

        this.controlWin.elementView.appendChild(w.element)
        if (typeof h === "function") h(w)
    }

    static get currentWindow() {
        return this.windows[this.windows.length - 1]
    }

    static newOverlay() {
        const w = new DOM({
            new: "div",
            class: "s--wm-aoi",
            id: `s--wm-over-${this.windows.length}`,

        })

        this.windows.push(w)

        this.controlOver.elementView.appendChild(w.element)
    }

    static get Scaffold() {
        const wins = new DOM({
            new: "div",
            id: "s--wm-windows",
        })

        const overs = new DOM({
            new: "div",
            id: "s--wm-overlays",
        })

        const sc = [
            wins,
            overs,
        ]

        this.controlWin = wins
        this.controlOver = overs
        this.scaffoldBuild = sc

        return sc
    }
}
