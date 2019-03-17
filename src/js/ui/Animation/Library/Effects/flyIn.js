import Linear from "../Timing/linear"
import Animation from "../../Classes/Animation"

export default class FlyIn {
    constructor({ timing = Linear, duration = 1000, direction = "bottom" } = {}) {
        let dir
        if (direction === "top") {
            dir = ["Y", 1, -1, "h"]
        } else if (direction === "left") {
            dir = ["X", 1, -1, "w"]
        } else if (direction === "right") {
            dir = ["X", -1, 1, "w"]
        } else {
            dir = ["Y", -1, 1, "h"]
        }
        return new Animation({
            duration,
            painter(time) {
                this.elementParse.native.style.transform = `translate${dir[0]}(${dir[1] * 100 + dir[2] * 100 * time}v${dir[3]})`
            },
            timingFunc: timing,
        })
    }
}
