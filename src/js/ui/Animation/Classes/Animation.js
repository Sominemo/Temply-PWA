import FieldsContainer from "../../../tools/validation/fieldsContainer"
import FieldChecker from "../../../tools/validation/fieldChecker"
import Linear from "../Library/Timing/linear"

export default class Animation {
    constructor({ duration, painter, timingFunc = Linear }) {
        new FieldsContainer([
            ["duration", "painter", "timingFunc"],
            {
                duration: new FieldChecker({ type: "number", isint: "true" }),
                painter: new FieldChecker({ type: "function" }),
                timingFunc: new FieldChecker({ type: "function" }),
            },
        ]).set({ duration, painter, timingFunc })

        this.duration = duration
        this.painter = painter
        this.timingFunc = timingFunc
    }

    apply(element, callback = () => { }) {
        const start = performance.now()

        let animate = (time) => {
            let timeProgress = (time - start) / this.duration
            if (timeProgress > 1) timeProgress = 1

            const effectProgress = this.timingFunc(timeProgress)
            this.painter.bind(element)(effectProgress)

            if (timeProgress < 1) {
                requestAnimationFrame(animate)
            } else callback(element)
        }

        animate = animate.bind(this)

        requestAnimationFrame(animate)
    }
}
