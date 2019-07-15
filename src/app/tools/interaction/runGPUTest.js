import test1 from "./GPUTests/1"
import test2 from "./GPUTests/2"

export default function runGPUTest(type = 1) {
    if (type === 2) return test2()
    return test1()
}
