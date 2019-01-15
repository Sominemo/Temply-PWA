import DOM from "../../dom"
import Icon from "../object/icon"
import FieldsContainer from "../../../../tools/internal/fieldsContainer"
import FieldChecker from "../../../../tools/internal/fieldChecker"

export default class Nav {
    static Toggle(e) {
        const item = "active"
        const n = document.querySelector("nav.main-nav")
        if (e === undefined) n.classList.toggle(item)
        else if (e) n.classList.add(item)
        else n.classList.remove(item)
    }

    constructor(menu) {
        const menuDom = []

        new FieldsContainer(["array", new FieldsContainer([
            ["icon", "name", "handler"],
            {
                icon: new FieldChecker({ type: "string" }),
                name: new FieldChecker({ type: "string" }),
                handler: new FieldChecker({ type: "function" }),
            },
        ])]).set(menu)

        menu.forEach((i) => {
            menuDom.push(
                new DOM({
                    new: "div",
                    class: "nav-item",
                    content: new Icon(i.icon),
                    attributes: {
                        hint: i.name,
                    },
                    events: {
                        event: "click",
                        handler: i.handler,
                    },
                }),
            )
        })

        return new DOM({
            new: "nav",
            class: "main-nav",
            content: [
                new DOM({
                    new: "div",
                    class: "mobile-gestue",
                }),
                new DOM({
                    new: "div",
                    class: "nav-content",
                    content: [
                        new DOM({
                            new: "div",
                            class: "menu-area",
                            content: new DOM({
                                new: "div",
                                class: "nav-item",
                                content: new Icon("menu"),
                            }),
                            events: [
                                {
                                    event: "click",
                                    handler: () => Nav.Toggle(),
                                },
                            ],
                        }),
                        new DOM({
                            new: "div",
                            class: "menu-buttons",
                            content: menuDom,
                        }),

                    ],
                }),
                new DOM({
                    new: "div",
                    class: "menu-pc-bottom",
                    content: new DOM({
                        new: "div",
                        class: "nav-item",
                        content: new Icon("account_circle"),
                    }),
                }),
            ],
        })
    }
}
