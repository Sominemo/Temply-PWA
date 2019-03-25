import DOM from "../../Classes/dom"
import { Card } from "../object/card"
import FadeIn from "../../../Animation/Library/Effects/fadeIn"
import FadeOut from "../../../Animation/Library/Effects/fadeOut"

export default class Popup {
    constructor(content, { control = {}, fullWidth = false } = {}) {
        const pop = () => {
            new FadeOut({ duration: 200 }).apply(control.element).then(() => control.pop())
        }
        const pe = new Card(new DOM({
            new: "div",
            class: ["card-scroll-container"],
            content: new DOM({
                new: "div",
                class: ["card-scroll-content"],
                content,
            }),
        }))

        return new DOM({
            new: "div",
            onRender(p, e) { new FadeIn({ duration: 200 }).apply(e) },
            class: ["popup-main-scaffold"],
            content: [
                new DOM({
                    new: "div",
                    class: ["blackout-fullscreen"],
                    events: [
                        {
                            event: "click",
                            handler() { return pop() },
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
                                }),
                            }),
                        }),
                }),
            ],
        })
    }
}
