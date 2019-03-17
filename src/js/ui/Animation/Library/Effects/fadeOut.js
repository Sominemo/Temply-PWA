import Linear from "../Timing/linear"
import reversedEase from "../Timing/Transformations/reverseEase"
import reversedTiming from "../Timing/Transformations/reverse"
import FadeIn from "./fadeIn"

export default class FadeOut {
    constructor({ timing = Linear, ...params } = {}) {
        return new FadeIn({
            ...params,
            timing: reversedTiming(reversedEase(timing)),
        })
    }
}
