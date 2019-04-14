import DOM from "../../Classes/dom"
import PointerInfo from "../../../../services/PointerInfo"
import Animation from "../../../Animation/Classes/Animation"
import EaseOutQuad from "../../../Animation/Library/Timing/easeOutQuad"
import EaseInQuad from "../../../Animation/Library/Timing/easeInQuad"
import WindowManager from "../../../SimpleWindowManager"

export default class ContextMenuElement {
    static closers = []

    static closeAll() {
        this.closers.forEach((e, i) => {
            if (typeof e === "function") {
                e()
                this.closers.splice(i, 1)
            }
        })
    }

    constructor({
        content = [], style = {}, coords = null, control = null, mode = "context", event = false,
    } = {}) {
        let x = 0
        let y = 0
        let size = {}
        let padding
        let margin
        let card
        let closing = false
        let outside
        let ft

        if (event) {
            event.preventDefault()
            event.stopPropagation()
            this.constructor.closeAll()
        }

        if (control) {
            control.element.classList.add("context-menu-handler-isolate")
        }

        if (coords === null) {
            const pi = event || (mode === "context" ? PointerInfo.lastContextEvent : PointerInfo.lastClickEvent)
            x = pi.clientX
            y = pi.clientY
        } else ({ x, y } = coords)


        const closeCurrent = async () => {
            if (closing) return false
            closing = true

            await new Animation({
                duration: 200,
                timingFunc: EaseInQuad,
                painter(t) {
                    t = 1 - t
                    this.style({
                        opacity: t,
                        width: `${size.width * t}px`,
                        height: `${size.height * t}px`,
                        overflow: "hidden",
                        minWidth: 0,
                        padding: `${t * padding[0]}px ${t * padding[1]}px ${t * padding[2]}px ${t * padding[3]}px`,
                        margin: `${t * margin[0]}px ${t * margin[1]}px ${t * margin[2]}px ${t * margin[3]}px`,
                    })
                },
            }).apply(card)

            if (typeof control.pop === "function") control.pop()
            else card.destructSelf()

            document.body.removeEventListener("click", outside)
            document.body.removeEventListener("context", outside)
            window.removeEventListener("resize", closeCurrent)
            WindowManager.controlWin.elementParse.native.removeEventListener("scroll", closeCurrent)
            return true
        }

        this.constructor.closers.push(closeCurrent)

        outside = (ev) => {
            if (!event && !ft) {
                ft = true
                return
            }

            if (card.contains(ev.target, true) || card.elementParse.native === ev.target) return
            closeCurrent()
        }


        document.body.addEventListener("click", outside)
        document.body.addEventListener("context", outside)
        window.addEventListener("resize", closeCurrent)
        WindowManager.controlWin.elementParse.native.addEventListener("scroll", closeCurrent)


        card = new DOM({
            new: "context-menu",
            content,
            style: {
                left: `${x}px`,
                top: `${y}px`,
                ...style,
            },
            onRendered(ev, el) {
                size = card.sizes
                padding = el.getStyle(["padding-top", "padding-right", "padding-bottom", "padding-left"]).map(e => parseFloat(e, 10))
                margin = el.getStyle(["margin-top", "margin-right", "margin-bottom", "margin-left"]).map(e => parseFloat(e, 10))

                card.style({
                    width: 0,
                    height: 0,
                })

                if (document.body.clientWidth < size.right) {
                    if (document.body.clientWidth <= size.width) {
                        card.style({
                            left: 0,
                            right: 0,
                        })
                    } else {
                        card.style({
                            left: `${document.body.clientWidth - size.width - margin[3] - margin[1]}px`,
                        })
                    }
                }

                if (document.body.clientHeight < size.bottom) {
                    if (document.body.clientHeight <= size.height) {
                        card.style({
                            top: 0,
                            bottom: 0,
                        })
                    } else if (size.y < size.height) {
                        card.style({
                            top: 0,
                        })
                    } else {
                        card.style({
                            transform: "translateY(-100%)",
                        })
                    }
                }

                new Animation({
                    duration: 200,
                    timingFunc: EaseOutQuad,
                    painter(t) {
                        this.style({
                            opacity: t,
                            width: `${size.width * t}px`,
                            height: `${size.height * t}px`,
                            overflow: "hidden",
                            minWidth: 0,
                            padding: `${t * padding[0]}px ${t * padding[1]}px ${t * padding[2]}px ${t * padding[3]}px`,
                            margin: `${t * margin[0]}px ${t * margin[1]}px ${t * margin[2]}px ${t * margin[3]}px`,
                        })
                    },
                }).apply(el).then(() => {
                    el.style({
                        opacity: "",
                        width: "",
                        height: "",
                        overflow: "",
                        padding: "",
                        margin: "",
                        minWidth: "",
                    })
                })
            },
        })

        return card
    }
}
