import DOM from "../../Classes/dom"
import Icon from "../object/icon"
import FieldsContainer from "../../../../tools/validation/fieldsContainer"
import FieldChecker from "../../../../tools/validation/fieldChecker"
import { ContextMenu } from "../elements"
import Navigation from "../../../../main/navigation"
import { $$ } from "../../../../services/Language/handler"

export default class Nav {
    static config = []

    static dom = []

    static html = null

    static mobileGestue = null

    static navItemIdPrefix = "nav-item-"

    static activeClassName = "active"

    static Toggle(e) {
        const current = Navigation.Current
        const custom = current.navMenu || []
        const size = e.sizes
        ContextMenu({
            coords: size,
            content: [
                ...(Object.keys(custom).length > 0 ? [...custom, { type: "delimeter" }] : []),
                {
                    icon: "settings",
                    title: $$("settings"),
                    handler() {
                        Navigation.hash = { module: "settings" }
                    },
                },
                {
                    icon: "info",
                    title: $$("@about/app"),
                    handler() {
                        Navigation.hash = { module: "about" }
                    },
                },
            ],
        })
    }

    get menuItems() {
        return this.config
    }

    static newItem(a) {
        new FieldsContainer([
            ["name", "icon", "handler", "id"],
            {
                icon: new FieldChecker({ type: "string" }),
                handler: new FieldChecker({ type: "function" }),
                id: new FieldChecker({ type: "string", symbols: "a-z_" }),
            },
        ]).set(a)

        if (this.config.some(e => e.id === a.id)) return

        this.config.push(a)

        if (this.html !== null) this.html.elementView.appendChild(this.generateElement(a).element)
    }

    static getById(id, index = false) {
        return this.config[`find${index ? "Index" : ""}`](e => e.id === id)
    }

    static removeById(id) {
        const nid = this.getById(id, true)
        delete this.config[nid]
        delete this.dom[nid]
        const elView = this.html.elementView
        const htmlCh = elView.children[nid]
        elView.removeChild(htmlCh)
    }

    static updateHTML() {
        if (this.html === null) return
        this.generateElementList()
        const eh = this.html.elementView
        eh.innerHTML = ""
        this.dom.forEach((el) => {
            eh.appendChild(el.element)
        })
    }

    static generateElement(i) {
        return new DOM({
            new: "div",
            class: "nav-item",
            id: `${this.navItemIdPrefix}${i.id}`,
            content: new Icon(i.icon),
            attributes: {
                hint: (typeof i.name === "function" ? i.name() : i.name.toString()),
            },
            events: {
                event: "click",
                handler: i.handler,
            },
            menuNavData: i,
        })
    }

    static get generateElementList() {
        new FieldsContainer(["array", new FieldsContainer([
            ["icon", "name", "handler", "id"],
            {
                icon: new FieldChecker({ type: "string" }),
                handler: new FieldChecker({ type: "function" }),
                id: new FieldChecker({ type: "string", symbols: "a-z_" }),
            },
        ])]).set(this.config)

        this.dom = []

        this.config.forEach((i) => {
            this.dom.push(this.generateElement(i))
        })

        return this.dom
    }

    static highlight(e) {
        document.querySelectorAll("nav .menu-buttons>.nav-item").forEach(a => a.classList.remove(this.activeClassName))
        const el = document.getElementById(`${this.navItemIdPrefix}${e.id}`)
        if (el !== null) {
            el.classList.add(this.activeClassName)
            this.currentActive = el
        } else this.currentActive = null
        this.updateGestuePosition()
    }

    static updateGestuePosition(el = false) {
        if (!this.mobileGestue) return
        if (el === false) el = this.currentActive
        if (el !== null) {
            this.mobileGestue.elementParse.native.style.top = `${el.offsetTop}px`
            this.mobileGestue.elementParse.native.style.left = "0"
        } else {
            this.mobileGestue.elementParse.native.style.left = "-100%"
        }
    }

    constructor() {
        const genDom = this.constructor.generateElementList
        this.constructor.html = new DOM({
            new: "div",
            class: "menu-buttons",
            content: genDom,
        })

        this.constructor.mobileGestue = new DOM({
            new: "div",
            class: "mobile-gestue",
        })

        return new DOM({
            new: "nav",
            class: "main-nav",
            content: [
                this.constructor.mobileGestue,
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
                                content: new Icon("more_vert"),
                            }),
                            events: [
                                {
                                    event: "click",
                                    handler(ev, el) { Nav.Toggle(el) },
                                },
                            ],
                        }),
                        this.constructor.html,

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
