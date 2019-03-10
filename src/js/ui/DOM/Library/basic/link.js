import DOM from "../../Classes/dom"

export default class Link {
    constructor(link, text, { external = true } = {}) {
        return new DOM({
            new: "a",
            attributes: {
                href: link,
                ...(external ? { target: "_blank" } : {}),
            },
            content: text,
        })
    }
}
