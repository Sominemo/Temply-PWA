import Linear from "../Timing/linear"
import reversedTiming from "../Timing/Transformations/reverse"
import reversedEase from "../Timing/Transformations/reverseEase"
import SlideIn from "./slideIn"

export default class SlideOut {
    constructor({ timing = Linear, ...params }) {
        return new SlideIn({
            init(el) {},
            end(el) {},
            ...params,
            timing: reversedTiming(reversedEase(timing)),
        })
    }
}
