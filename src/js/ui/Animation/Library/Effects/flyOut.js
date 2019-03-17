import Linear from "../Timing/linear"
import reversedEase from "../Timing/Transformations/reverseEase"
import reversedTiming from "../Timing/Transformations/reverse"
import FlyIn from "./flyIn"

export default class FlyOut {
    constructor({ timing = Linear, ...params } = {}) {
        return new FlyIn({
            ...params,
            timing: reversedTiming(reversedEase(timing)),
        })
    }
}
