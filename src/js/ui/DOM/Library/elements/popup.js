import DOM from "../../Classes/dom"
import { Card } from "../object/card"

export default class Popup {
    constructor(content, { pop = () => { }, fullWidth = false } = {}) {
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
