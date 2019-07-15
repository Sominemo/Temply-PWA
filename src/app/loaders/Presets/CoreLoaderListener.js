import Report from "@Core/Services/report"
import { CoreLoader } from "@Core/Init/CoreLoader"

CoreLoader.addDoneListener((loaded) => {
    if (loaded.result.state !== 0) {
        const out = [loaded.name]
        if (loaded.result.answer) out.push(loaded.result.answer)
        if (loaded.result.data) out.push(loaded.result.data)
        if (loaded.result.state === 1) Report.error(...out)
        if (loaded.result.state === 2) Report.warn(...out)
    } else {
        const out = []
        if (loaded.result.type === 1) {
            out.push(`%c DONE %c ${loaded.name}${(loaded.result.answer && loaded.result.answer !== true ? `: ${String(loaded.result.answer)}` : "")}`, "background: #4caf50; color: #ffffff", "")
        } else if (loaded.result.type === 2) {
            out.push(`%c SKIP %c ${loaded.name}${(loaded.result.answer && loaded.result.answer !== true ? `: ${String(loaded.result.answer)}` : "")}`, "background: #0095ff; color: #ffffff", "")
        }
        if (loaded.result.data) out.push(loaded.result.data)
        Report.writeNoTrace(...out)
    }
})
