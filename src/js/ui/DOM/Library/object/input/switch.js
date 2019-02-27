import DOM from "../../../Classes/dom"

export default class Switch {
    static stateAttr = "state"

    static lockedAttr = "locked"

    constructor(
        state = false,
        onchange = (newValue, observer = false) => { },
        { locked = false, include = false } = {},
    ) {
        let element
        const changeState = (s, o = false) => {
            s = (s ? 1 : 0)
            if (!o) {
                element.elementParse.native
                    .setAttribute(this.constructor.stateAttr, s.toString())
            } else { onchange(s, o) }
        }

        const toggleState = () => {
            changeState(!(parseInt(element.elementParse.native
                .getAttribute(this.constructor.stateAttr), 10)))
        }

        const changeStateHandler = (r, o) => {
            r.forEach((e) => {
                if (e.attributeName === this.constructor.stateAttr) {
                    changeState(parseInt(element.elementParse.native
                        .getAttribute(this.constructor.stateAttr), 10), o)
                }
            })
        }

        element = new DOM({
            new: "switch-input",
            attributes: {
                state: (state ? 1 : 0),
            },
            mutations: [
                {
                    config: { attributes: true, attributeOldValue: true },
                    handler: changeStateHandler,
                },
            ],
            events: [
                ...(include ? [] : [{
                    event: "click",
                    handler: toggleState,
                }]),
            ],
        })

        return (include ? [element, toggleState] : element)
    }
}
