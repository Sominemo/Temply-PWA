import Animation from "../../Classes/Animation"

export default class SlideOut {
    constructor({ renderAwait = false, ...params }) {
        let original
        let padding = [0, 0, 0, 0]
        let margin = [0, 0, 0, 0]
        return new Animation({
            init(el) {
                function getDimensions() {
                    original = el.sizes
                    padding = el.getStyle(["padding-top", "padding-right", "padding-bottom", "padding-left"]).map(e => parseFloat(e, 10))
                    margin = el.getStyle(["margin-top", "margin-right", "margin-bottom", "margin-left"]).map(e => parseFloat(e, 10))
                }

                if (renderAwait) {
                    return new Promise((resolve, reject) => {
                        el.onEvent("rendered", () => {
                            getDimensions()
                            resolve()
                        })
                    })
                }

                getDimensions()
                return true
            },
            end(el) {
                el.style({
                    position: "absolute",
                    visibility: "hidden",
                })
            },
            ...params,
            painter(time) {
                time = 1 - time
                this.style({
                    position: "",
                    visibility: "",
                    overflow: "hidden",
                    height: `${time * original.height}px`,
                    padding: `${time * padding[0]}px ${time * padding[1]}px ${time * padding[2]}px ${time * padding[3]}px`,
                    margin: `${time * margin[0]}px ${time * margin[1]}px ${time * margin[2]}px ${time * margin[3]}px`,
                })
            },
        })
    }
}
