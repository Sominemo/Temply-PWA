import Prompt from "../../../ui/DOM/Library/elements/prompt"
import { CardContent } from "../../../ui/DOM/Library/object/card"
import { TwoSidesWrapper, Preloader } from "../../../ui/DOM/Library/object"
import DOM from "../../../ui/DOM/Classes/dom"
import { Padding } from "../../../ui/DOM/Library/style"
import DOMObjectWrapper from "../../../ui/DOM/Helpers/domObjectWrapper"
import Design from "../../../main/design"
import Animation from "../../../ui/Animation/Classes/Animation"
import Sleep from "../../objects/sleep"
import BRify from "../../transformation/text/BRify"

const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length

const app = (min, max) => Math.random() * (max - min) + min

function randomRgba() {
    const o = Math.round; const r = Math.random; const
        s = 255
    return `rgba(${o(r() * s)},${o(r() * s)},${o(r() * s)},${r().toFixed(1)})`
}

export default function runGPUTest() {
    const c = new DOM({ new: "div" })
    let iframe

    async function test() {
        const realBody = iframe.elementParse.native.contentWindow.document.body
        const i = DOMObjectWrapper(realBody)

        realBody.style.background = Design.getVar("color-card-background")
        realBody.style.overflow = "hidden"
        const size = app(50, 100)

        const square1 = new DOM({
            new: "div",
            style: {
                height: `${size}vmin`,
                width: `${size}vmin`,
                background: randomRgba(),
                position: "absolute",
                top: "0",
                left: "0",
                color: "white",
                textShadow: "0 0 5px black",
                fontSize: `${size / 1.5}vmin`,
                boxShadow: "0 0 20px black",
                borderRadius: "2em",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                overflow: "scroll",
                transition: "height .2s, opacity .1s",
            },
            content: Math.random().toString(36).substring(2, 17),
            events: ["scroll", "touchstart", "touchmove", "touchend", "mouseover"].map(e => ({ event: e, handler: () => { } })),
        })

        const square2 = new DOM({
            new: "div",
            style: {
                height: `${size}vmin`,
                width: `${size}vmin`,
                background: randomRgba(),
                position: "absolute",
                bottom: "0",
                right: "0",
                color: "white",
                textShadow: "0 0 5px black",
                fontSize: `${size / 1.5}vmin`,
                boxShadow: "0 0 20px black",
                borderRadius: "2em",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                overflow: "scroll",
                transition: "height .2s, opacity .1s",
            },
            content: Math.random().toString(36).substring(2, 17),
            events: ["scroll", "touchstart", "touchmove", "touchend", "mouseover"].map(e => ({ event: e, handler: () => { } })),
        })

        const square1B = new DOM({
            new: "div",
            content: square1,
            style: { filter: `blur(${Math.round(Math.random() * 100)}px)` },
        })
        const square2B = new DOM({
            new: "div",
            content: square2,
            style: { filter: `blur(${Math.round(Math.random() * 100)}px)` },
        })

        i.render(square1B)
        i.render(square2B)

        await Sleep(200)

        const tests = []

        const res = [...Array(2)].map(e => Array(0))

        tests.push(new Animation({
            duration: 1000,
            painter(time) {
                res[0].push(performance.now())
                this.style({
                    top: `${time * 100}%`,
                    left: `${time * 100}%`,
                    filter: `blur(${time * 10}vmax)`,
                    transform: `rotate3d(${size * time},${size * time},${size * time}, ${size * time}deg)`,
                    height: `${size * (1 - time)}px`,
                    opacity: Math.random(),
                    zIndex: Math.round(Math.random()),
                })
                this.elementParse.native.scrollLeft = this.elementParse.native.scrollWidth * time
            },
        }).apply(square1))

        tests.push(new Animation({
            duration: 1000,
            painter(time) {
                res[1].push(performance.now())
                this.style({
                    bottom: `${time * 100}%`,
                    right: `${time * 100}%`,
                    filter: `blur(${time * 10}vmax)`,
                    transform: `rotate3d(${size * time},${size * time},${size * time}, ${size * time}deg)`,
                    height: `${size * (1 - time)}px`,
                    opacity: Math.random(),
                    zIndex: Math.round(Math.random()),
                })
                this.elementParse.native.scrollLeft = this.elementParse.native.scrollWidth * time
            },
        }).apply(square2))

        await Promise.all(tests)
        let min = Number.MAX_VALUE
        let max = -1

        const resTests = res.map(e => average(e.map((el, ind, arr) => {
            if (ind === 0) return 0
            const r = el - arr[ind - 1]
            if (r < min) min = r
            if (r > max) max = r
            return r
        }).slice(1)))

        const result = average(resTests)

        c.clear(
            ...BRify(
                `Done.
1) Average of all frame-timeouts: ${Math.floor(result)} 
2) Average Min & Max: ${Math.floor(average([min, max]))}
3) 1 and 2 difference: ${Math.abs(Math.floor(result - average([min, max])))}
4) Min: ${Math.floor(min)}
5) Max: ${Math.floor(max)}
6) Min/Max: ${Math.floor(max / min)}`,
            ),
        )
    }

    iframe = new DOM({
        new: "iframe",
        style: {
            width: "100%",
            border: "0",
        },
        events: [
            {
                event: "load",
                handler: test,
            },
        ],
    })

    c.render(new CardContent(
        [
            new TwoSidesWrapper(
                new Preloader(),
                new Padding("Temply runs a benchmark to test your device's graphical capabilities", 10),
            ),
            iframe,
        ],
    ))

    Prompt({
        title: "Benchmarking",
        text: c,
    })
}
