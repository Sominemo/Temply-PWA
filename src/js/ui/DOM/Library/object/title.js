import DOM from "../../Classes/dom"

export default class Title {
    constructor(content, level = 1, style = {}, icon) {
        if (icon && !(icon instanceof DOM)) throw new TypeError("Only DOM-object can be prefixed")
        return new DOM({
            new: "div",
            style,
            class: ["inline-title-block", `inline-title-level-${parseInt(level.toString(), 10)}`],
            content: new DOM({
                new: "div",
                class: ["flex-container"],
                content: [
                    ...(icon ? [icon] : []),
                    new DOM({
                        new: "span",
                        class: ["title-text-content"],
                        content: content.toString(),
                    }),
                ],
            }),
        })
    }
}
