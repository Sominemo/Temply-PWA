import DOM from "../../Classes/dom"
import FlyIn from "../../../Animation/Library/Effects/flyIn"
import { Button } from "../object/input"
import EaseOutQuad from "../../../Animation/Library/Timing/easeOutQuad"
import FlyOut from "../../../Animation/Library/Effects/flyOut"
import { Padding } from "../style"

export default class ToastElement {
    constructor(content, { buttons = [], click = false, duration } = {}, control) {
        let mouseOn = false
        let popCalled = false
        let swipeMode = false
        const oFunc = control.pop
        control.pop = (...p) => {
            if (popCalled) return
            popCalled = true
            oFunc(...p)
        }

        const toast = new DOM({
            new: "md-toast",
            style: {
                transform: "translateY(100vh)",
            },
            onRender(p, e) {
                new FlyIn({ direction: "top", duration: 500, timing: EaseOutQuad }).apply(e)
                    .then(() => {
                        if (duration <= 0) return
                        const check = () => {
                            if (!mouseOn) {
                                new FlyOut({ direction: "top", duration: 500, timing: EaseOutQuad })
                                    .apply(e).then(control.pop)
                            } else setTimeout(check, duration)
                        }
                        setTimeout(check, duration)
                    })
            },
            events: [
                {
                    event: "click",
                    handler(me, el) {
                        if (typeof click !== "function") return
                        new FlyOut({ direction: "top", duration: 500, timing: EaseOutQuad })
                            .apply(el).then(control.pop)
                        click()
                    },
                },
                {
                    event: "contextmenu",
                    handler(me, el) {
                        if (swipeMode) return
                        new FlyOut({ direction: "top", duration: 500, timing: EaseOutQuad })
                            .apply(el).then(control.pop)
                        me.preventDefault()
                    },
                },
                {
                    event: "mouseenter",
                    handler() {
                        mouseOn = true
                    },
                },
                {
                    event: "mouseleave",
                    handler() {
                        mouseOn = false
                    },
                },
            ],
            content: new DOM({
                new: "div",
                class: ["flex-container", "md-toast-inner"],
                content: [
                    new DOM({
                        new: "div",
                        class: ["md-toast-main-content"],
                        content: (typeof content === "string" ? new Padding(content, 15) : content),
                    }),
                    new DOM({
                        new: "div",
                        class: ["md-toast-buttons", "flex-container"],
                        content: [
                            ...buttons.map(b => new Button({
                                handler(m) {
                                    m.stopPropagation()
                                    new FlyOut({ direction: "top", duration: 500, timing: EaseOutQuad })
                                        .apply(toast).then(control.pop)
                                    return b.handler.bind(this)()
                                },
                                content: b.content,
                                type: ["transparentMDButton"],
                            })),
                            /* new DOM({
                                new: "div",
                                class: ["md-toast-close-button-holder"],
                                events: [
                                    {
                                        event: "click",
                                        handler(ev) {
                                            control.pop()
                                            ev.stopPropagation()
                                        },
                                    },
                                ],
                                content: new Icon("close"),
                            }), */
                        ],
                    }),
                ],
            }),
        })

        return new DOM({
            new: "div",
            class: ["md-toast-container"],
            content: toast,
            events: [
                {
                    event: "touchstart",
                    handler(me, el) {
                        const maxHeight = me.targetTouches[0].clientY
                        let opacity = 1
                        mouseOn = true
                        swipeMode = true
                        this.addEventListener("touchmove", (me2) => {
                            me.preventDefault()
                            mouseOn = true
                            const bottom = document.documentElement.clientHeight
                                - me2.targetTouches[0].clientY
                                - this.clientHeight / 2

                            if (me2.targetTouches[0].clientY < maxHeight) {
                                this.style.bottom = ""
                            } else { this.style.bottom = `${bottom}px` }
                            opacity = 1 - ((me2.targetTouches[0].clientY - maxHeight)
                                / maxHeight) * 6
                            this.style.opacity = (opacity < 0 ? 0 : opacity)
                        })

                        this.addEventListener("touchend", () => {
                            mouseOn = false
                            swipeMode = false
                            if (opacity < 0.6) {
                                this.classList.add("transanim")
                                this.style.opacity = 0
                                new FlyOut({ direction: "top", duration: 200, timing: EaseOutQuad })
                                    .apply(el).then(control.pop)
                            } else {
                                opacity = 1
                                this.style.opacity = ""
                                this.style.bottom = ""
                                this.classList.add("transanim")
                                setTimeout(() => { this.classList.remove("transanim") }, 200)
                            }
                        })
                    },
                },
            ],
        })
    }
}
