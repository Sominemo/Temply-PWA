import DOM from "../../Classes/dom"
import { Card } from "../object/card"
import FadeIn from "../../../Animation/Library/Effects/fadeIn"
import FadeOut from "../../../Animation/Library/Effects/fadeOut"

export default class Popup {
    constructor(content, {
        control = {}, fullWidth = false, fullHeight = false, noClose = false, fixedContext = false,
    } = {}) {
        let escapeListener

        const pop = () => {
            document.removeEventListener("keyup", escapeListener)
            if (fixedContext) window.removeEventListener("appNavigation", pop)
            new FadeOut({ duration: 200 }).apply(control.element).then(() => control.pop())
        }

        escapeListener = (evt) => {
            if ((evt.key === "Escape" || evt.key === "Esc") && !noClose) pop()
        }

        const pe = new Card(new DOM({
            new: "div",
            class: ["card-scroll-container"],
            content: new DOM({
                new: "div",
                class: ["card-scroll-content"],
                content,
                style: {
                    ...(fullHeight ? { height: "100%" } : {}),
                },
            }),
            style: {
                ...(fullHeight ? { height: "100%" } : {}),
            },
        }), {
            style: {
                ...(fullHeight ? { height: "100%" } : {}),
            },
        })

        document.addEventListener("keyup", escapeListener)
        if (fixedContext) window.addEventListener("appNavigation", pop)

        return new DOM({
            new: "div",
            onRender(p, e) { new FadeIn({ duration: 200 }).apply(e) },
            class: ["popup-main-scaffold"],
            objectProperty: [
                {
                    name: "close",
                    handler: pop,
                },
            ],
            content: [
                new DOM({
                    new: "div",
                    class: ["blackout-fullscreen"],
                    events: [
                        {
                            event: "click",
                            handler() {
                                if (!noClose) return pop()
                                return true
                            },
                        },
                    ],
                }),
                new DOM({
                    new: "div",
                    class: ["absolute-popup-container"],
                    content:
                        new DOM({
                            new: "div",
                            class: ["popup-position-wrap"],
                            content: new DOM({
                                new: "div",
                                class: ["popup-limit-container"],
                                style: {
                                    ...(fullWidth ? { width: "100%" } : {}),
                                },
                                content: new DOM({
                                    new: "div",
                                    class: ["popup-under-limit-position"],
                                    content: pe,
                                    style: {
                                        ...(fullHeight ? { height: "100%" } : {}),
                                    },
                                }),
                            }),
                        }),
                }),
            ],
        })
    }
}
