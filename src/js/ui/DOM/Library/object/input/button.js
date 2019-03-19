import DOM from "../../../Classes/dom"
import Animation from "../../../../Animation/Classes/Animation"
import DOMObjectWrapper from "../../../Helpers/domObjectWrapper"

export default class Button {
    constructor({
        content, handler, type = "bright", style = {},
    }) {
        type = (Array.isArray(type) ? type : [type])
        function rippleOut(ripple) {
            new Animation({
                duration: 200,
                painter(t) {
                    ripple.style.opacity = 1 - t
                },
            }).apply(this, () => {
                const pn = ripple.parentNode
                if (pn) pn.removeChild(ripple)
            })
        }
        return new DOM({
            new: "md-button",
            class: [...type],
            content,
            style,
            events: [{
                event: "click",
                handler(ev) {
                    const biggerSide = (this.clientHeight > this.clientWidth
                        ? this.clientHeight : this.clientWidth)
                    const self = this

                    const ripple = new DOM({
                        new: "md-ripple-effect",
                        onRender(p, e) {
                            e.elementParse.native.style.top = `${ev.layerY}px`
                            e.elementParse.native.style.left = `${ev.layerX}px`
                            if (!ev.isTrusted) {
                                e.elementParse.native.style.top = `${self.clientHeight / 2}px`
                                e.elementParse.native.style.left = `${self.clientWidth / 2}px`
                            }

                            new Animation({
                                duration: 100,
                                painter(t) {
                                    e.elementParse.native.style.width = `${t * biggerSide * 2}px`
                                    e.elementParse.native.style.height = `${t * biggerSide * 2}px`
                                },
                            }).apply(e, () => rippleOut(e.elementParse.native))
                        },
                    })

                    DOMObjectWrapper(this).render(ripple)

                    handler(ev)
                },
            },
            {
                event: "mouseout",
                handler() {
                    this.querySelectorAll("md-ripple-effect").forEach((r) => {
                        rippleOut(r)
                    })
                },
            },
            {
                event: "blur",
                handler() {
                    this.querySelectorAll("md-ripple-effect").forEach((r) => {
                        rippleOut(r)
                    })
                },
            },
            ],
        })
    }
}
