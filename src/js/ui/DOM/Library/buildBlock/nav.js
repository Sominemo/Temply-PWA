import DOM from "../../Classes/dom"
import Icon from "../object/icon"
import FieldsContainer from "../../../../tools/validation/fieldsContainer"
import FieldChecker from "../../../../tools/validation/fieldChecker"
import { ContextMenu, ContextMenuElement } from "../elements"
import Navigation from "../../../../main/navigation"
import { $$ } from "../../../../services/Language/handler"
import Design from "../../../../main/design"
import Animation from "../../../Animation/Classes/Animation"
import EaseInOutQuad from "../../../Animation/Library/Timing/easeInOutQuad"

export default class Nav {
    static config = []

    static dom = []

    static html = null

    static mobileGesture = null

    static navItemIdPrefix = "nav-item-"

    static activeClassName = "active"

    static triggeredSwipe = false

    static get navigationList() {
        const current = Navigation.Current
        const custom = current.navMenu || []

        return [
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
        ]
    }

    static Toggle(e, ev) {
        ev.stopPropagation()
        ContextMenuElement.closeAll()
        const size = e.sizes
        ContextMenu({
            coords: size,
            content: this.navigationList,
        })
    }

    static NavSwipeToggle(e) {
        const self = this
        const minTop = e.touches[0].clientY
        const minLeft = e.touches[0].clientX
        if (Design.getVar("nav-bottom", true) !== "1") return
        let cardStuff
        let touchYLast = "0"

        let handlerLvl2
        let handlerLvl3
        let handlerLvl2triggered = false
        let handlerLvl3triggered = false
        const windowHeight = document.body.clientHeight


        const handlerLvl1 = (ev) => {
            if (
                minTop - ev.touches[0].clientY < Design.getVar("size-nav-width", true, true) / 2
                || Math.abs(ev.touches[0].clientX - minLeft) > Design.getVar("size-nav-width", true, true) / 2
            ) {
                this.mobileGesture.classList.add("animated")
                setTimeout(() => {
                    this.mobileGesture.classList.remove("animated")
                }, 200)
                return
            }

            self.triggeredSwipe = true

            cardStuff = ContextMenu({
                coords: { x: 0, y: 0 },
                content: [
                    {
                        type: "element",
                        title: new DOM({
                            new: "div",
                            class: "mobile-gesture",
                        }),
                    },
                    ...self.navigationList,
                ],
                noSelfControl: true,
                renderClasses: ["swiper", "start", "hide"],
                onClose() {
                    self.triggeredSwipe = false
                },
                async onClosing() {
                    await new Animation({
                        duration: 200,
                        timingFunc: EaseInOutQuad,
                        painter(t) {
                            this.style({
                                transform: "",
                            })
                        },
                    }).apply(cardStuff[0])
                },
                onRendered(evn, el) {
                    document.removeEventListener("touchmove", handlerLvl1)
                    document.addEventListener("touchmove", handlerLvl2)
                    document.addEventListener("touchend", handlerLvl3)
                },
            })
            setTimeout(() => {
                if (!handlerLvl2triggered) handlerLvl2(ev)
            }, 100)
        }

        handlerLvl2 = (ev) => {
            handlerLvl2triggered = true
            if (handlerLvl3triggered) {
                cardStuff[0].style({
                    transform: "none !important",
                })
                cardStuff[0].classList.remove("hide")
                return
            }
            touchYLast = ev.touches[0].clientY
            cardStuff[0].style({
                maxHeight: `${windowHeight - touchYLast}px`,
                transform: "none !important",
            })
            cardStuff[0].classList.remove("hide")
        }


        handlerLvl3 = (ev) => {
            handlerLvl3triggered = true
            document.removeEventListener("touchmove", handlerLvl2)
            if (Design.getVar("size-nav-width", true, true) > windowHeight - ev.changedTouches[0].clientY) {
                cardStuff[0].classList.add("start")
                cardStuff[0].emitEvent("contextMenuClose")
            } else {
                cardStuff[0].style({
                    maxHeight: "",
                    transform: "none !important",
                    transition: "all .2s",
                })
            }
            document.removeEventListener("touchend", handlerLvl3)
        }

        document.addEventListener("touchmove", handlerLvl1)

        const end = () => {
            document.removeEventListener("touchmove", handlerLvl1)
            document.removeEventListener("touchend", end)
        }

        document.addEventListener("touchend", end)
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

        if (this.html !== null) {
            const generated = this.generateElement(a)
            this.dom.push({
                id: a.id,
                element: generated,
            })
            this.html.render(generated)
        }
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
        const curr = []

        this.config.forEach((i) => {
            const generated = this.generateElement(i)
            this.dom.push({
                id: i.id,
                element: generated,
            })
            curr.push(generated)
        })

        return curr
    }

    static highlight(e) {
        this.dom.forEach(a => a.element.classList.remove(this.activeClassName))
        const ele = this.dom.find(em => em.id === e.id)
        if (ele !== undefined) {
            const el = ele.element
            el.classList.add(this.activeClassName)
            this.currentActive = el
        } else this.currentActive = null
        this.updateGesturePosition()
    }

    static updateGesturePosition(el = false) {
        if (!this.mobileGesture) return
        if (el === false) el = this.currentActive
        if (el) {
            this.mobileGesture.style({ top: `${el.elementParse.native.offsetTop}px`, left: "0" })
        } else {
            this.mobileGesture.style({ left: "-100%" })
        }
    }

    constructor() {
        const self = this
        const genDom = this.constructor.generateElementList
        this.constructor.html = new DOM({
            new: "div",
            class: "menu-buttons",
            content: genDom,
        })

        this.constructor.mobileGesture = new DOM({
            new: "div",
            class: "mobile-gesture",
        })

        return new DOM({
            new: "nav",
            class: "main-nav",
            events: [
                {
                    event: "touchstart",
                    handler(e) {
                        self.constructor.NavSwipeToggle(e)
                    },
                    params: { passive: true },
                },
                {
                    event: "mouseup",
                    handler(e) {
                        if (Design.getVar("nav-bottom", true) !== "1" || e.button !== 2) return

                        ContextMenu({
                            content: self.constructor.navigationList,
                            event: e,
                        })
                    },
                },
            ],
            content: [
                this.constructor.mobileGesture,
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
                                    handler(ev, el) { Nav.Toggle(el, ev) },
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
