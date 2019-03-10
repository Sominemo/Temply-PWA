import DOM from "../../../Classes/dom"
import FieldsContainer from "../../../../../tools/validation/fieldsContainer"
import FieldChecker from "../../../../../tools/validation/fieldChecker"

export default class Radio {
    constructor(data = [], cls = [], global = {}) {
        new FieldsContainer(["array",
            new FieldsContainer([
                [],
                {
                    handler: new FieldChecker({ type: "function" }),
                    selected: new FieldChecker({ type: "boolean" }),
                    element: new FieldChecker({ type: "object" }),
                },
            ]),
        ]).set(data)

        const res = []
        let selection = data.findIndex(e => e.selected)

        data.forEach((e, i) => {
            e = { ...global, ...e }

            function clickHandler(force = false) {
                res.forEach((r) => {
                    if (e.include && force !== true) return
                    if (i === selection) return
                    (e.include ? r[0] : r).elementParse.native.removeAttribute("selected-radio")
                    this.setAttribute("selected-radio", "")
                })
            }

            const el = new DOM({
                new: "radio-handler",
                content: e.element,
                attributes: {
                    ...(e.selected ? { selectedRadio: "" } : {}),
                },
                class: cls,
                mutations: [
                    {
                        config: { attributes: true, attributeOldValue: true },
                        handler(r) {
                            r.forEach((ei) => {
                                if (ei.attributeName === "selected-radio") {
                                    const state = ei.target.hasAttribute("selected-radio")
                                    if (!(state === true && i === selection)) {
                                        if (state === true) selection = i
                                        if (typeof e.handler === "function") {
                                            e.handler(
                                                state,
                                                i, ei.target, this,
                                            )
                                        }
                                    }
                                }
                            })
                        },
                    },
                ],
                events: [
                    ...(!e.include ? [{
                        event: "click",
                        handler() {
                            return clickHandler.bind(this)()
                        },
                    }] : []),
                ],
            })
            res.push((e.include ? [el, () => clickHandler.bind(el.elementParse.native)(true)] : el))
        })

        return res
    }
}
