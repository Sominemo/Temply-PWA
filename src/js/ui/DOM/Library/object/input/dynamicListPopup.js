import { Popup } from "../../elements"
import DOM from "../../../Classes/dom"
import WindowManager from "../../../../SimpleWindowManager"
import TextInput from "./textInput"
import IconSide from "../iconSide"
import Preloader from "../preloader"
import FadeOut from "../../../../Animation/Library/Effects/fadeOut"
import Design from "../../../../../main/design"

export default async function DynamicListPopup(
    {
        icon = null,
        placeholder = "",
        list = () => [],
        onSelect = (value) => { },
        trim = true,
        onContext = () => { },
        inputMax = -1,
    } = {},
) {
    const o = WindowManager.newOverlay()
    let res = []
    let elements = []
    let searchInput

    function toItem(e, index) {
        return new DOM({
            new: "md-simple-list-item",
            tabIndex: 1,
            content: new IconSide(e.icon, e.name, { style: { marginRight: "10px", color: (e.color ? e.color : Design.getVar("color-context-menu-icon")) } }),
            ...("value" in e ? {
                events: [
                    {
                        event: "click",
                        async handler() {
                            new FadeOut({ duration: 200 }).apply(o.element).then(() => o.pop())
                            const pass = (typeof e.value === "function" ? await e.value() : e.value)
                            onSelect(pass)
                        },
                    },
                    {
                        event: "contextmenu",
                        handler(ev, el) {
                            onContext(e, ev, el)
                        },
                    },
                    {
                        event: "keypress",
                        handler(ev, el) {
                            if (ev.keyCode === 13) {
                                el.elementParse.native.click()
                                ev.stopPropagation()
                            }
                        },
                    },
                    {
                        event: "keydown",
                        handler(ev) {
                            if (ev.key === "ArrowDown") {
                                if (index !== 0) elements[index - 1].elementParse.native.focus()
                                else searchInput.elementParse.native.focus()
                            }
                            if (ev.key === "ArrowUp") {
                                if (index !== elements.length - 1) {
                                    elements[index + 1].elementParse.native.focus()
                                } else {
                                    elements[0].elementParse.native.focus()
                                }
                            }
                        },
                    },
                ],
            } : {}),
        })
    }

    function fillElements() {
        elements = res.map(toItem)
        return elements
    }

    const results = new DOM({
        new: "div",
        style: {
            height: "100%",
            overflowY: "auto",
            flexDirection: "column-reverse",
            display: "flex",
        },
        content: new Preloader({ style: { margin: "auto" } }),
    })

    const resultsBox = new DOM({
        new: "div",
        style: {
            height: "calc(100% - 80px)",
            position: "relative",
        },
        content: results,
    })
    searchInput = new TextInput({
        set: {
            placeholder,
            maxLength: inputMax,
        },
        style: {
            padding: "10px",
            borderRadius: "2em",
            boxShadow: "0 2px 5px rgba(0,0,0,.05)",
            background: Design.getVar("color-dedicated-accent-box-input"),
        },
        events: [
            {
                event: "keyup",
                handler(ev) {
                    if (ev.keyCode === 13) {
                        for (let i = 0; i < res.length; i++) {
                            if ("value" in res[i]) {
                                elements[i].elementParse.native.focus()
                                elements[i].elementParse.native.click()
                                break
                            }
                        }
                    }
                    if (ev.key === "ArrowUp") {
                        if (0 in elements) elements[0].elementParse.native.focus()
                    }
                },
            },
            {
                event: "input",
                async handler(ev, el) {
                    res = await list(el.currentValue.trim())
                    results.clear()
                    fillElements().map(e => results.render(e))
                },
            },
        ],
        params: {
            onRendered(ev, el) {
                setTimeout(() => {
                    el.elementParse.native.focus()
                }, 200)
            },
        },
    })
    const searchBox = new DOM({
        new: "div",
        content: new IconSide(
            icon,
            searchInput,
            {
                style: { margin: ".5em", color: Design.getVar("color-accent") },
                containerStyle: { width: "100%" },
                contentStyle: { marginRight: ".5em", flexGrow: "1" },
            },
        ),
        style: {
            display: "flex",
            background: Design.getVar("color-dedicated-accent-box"),
            height: "80px",
        },
    })

    const content = new DOM({
        new: "div",
        style: {
            height: "100%",
            position: "relative",
        },
        content: [
            resultsBox,
            searchBox,
        ],
    })
    o.append(new Popup(content, {
        control: o, fullWidth: true, fullHeight: true, fixedContext: true,
    }))

    res = await list("")
    results.clear()

    fillElements().map(e => results.render(e))
}
