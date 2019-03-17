import DOM from "../../Classes/dom"
import FlyIn from "../../../Animation/Library/Effects/flyIn"
import { Button } from "../object/input"
import { Icon } from "../object"

export default class ToastElement {
    constructor(content, buttons) {
        const toast = new DOM({
            new: "md-toast",
            onRender(p, e) {
                new FlyIn({ direction: "top" }).apply(e)
            },
            content: new DOM({
                new: "div",
                class: ["flex-container"],
                content: [
                    content,
                    new DOM({
                        new: "div",
                        class: ["md-toast-buttons", "flex-container"],
                        content: [
                            ...buttons.map(b => new Button({
                                handler: b.handler,
                                content: b.content,
                                type: ["transparentMDButton"],
                            })),
                            new Icon("cancel"),
                        ],
                    }),
                ],
            }),
        })

        return toast
    }
}
