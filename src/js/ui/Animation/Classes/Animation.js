import FieldsContainer from "../../../tools/validation/fieldsContainer"
import FieldChecker from "../../../tools/validation/fieldChecker"
import Linear from "../Library/Timing/linear"

export default class Animation {
    constructor({
        duration, painter, init = () => { }, end = () => { }, timingFunc = Linear,
    }) {
        new FieldsContainer([
            ["duration", "painter", "timingFunc"],
            {
                duration: new FieldChecker({ type: "number", isint: "true" }),
                painter: new FieldChecker({ type: "function" }),
                timingFunc: new FieldChecker({ type: "function" }),
                init: new FieldChecker({ type: "function" }),
                end: new FieldChecker({ type: "function" }),
            },
        ]).set({
            duration, painter, timingFunc, init, end,
        })

        this.duration = duration
        this.painter = painter
        this.timingFunc = timingFunc
        this.init = init
        this.end = end
    }

    animate(element) {
        return new Promise(async (resolve, reject) => {
            const init = await this.init(element)
            const start = performance.now()

            let animate = async (time) => {
                let timeProgress = (time - start) / this.duration
                if (timeProgress > 1) timeProgress = 1

                const effectProgress = this.timingFunc(timeProgress)
                this.painter.bind(element)(effectProgress)

                if (timeProgress < 1) {
                    requestAnimationFrame(animate, init)
                } else {
                    await this.end(element)
                    resolve(element)
                }
            }

            animate = animate.bind(this)

            requestAnimationFrame(animate, init)
        })
    }

    apply(...data) {
        return this.animate(...data)
    }

    applyCallback({ data = [], callback = () => { } }) {
        this.animate(...data)
            .then(e => callback(e))
    }
}
