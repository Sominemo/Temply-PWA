import DOM from "@DOMPath/DOM/Classes/dom"
import DOMObjectWrapper from "@DOMPath/DOM/Helpers/domObjectWrapper"
import Design from "@Core/Services/design"
import Sleep from "@Core/Tools/objects/sleep"
import BRify from "@Core/Tools/transformation/text/BRify"
import { CardContent } from "@Environment/Library/DOM/object/card"
import { TwoSidesWrapper, Preloader } from "@Environment/Library/DOM/object"
import { Padding } from "@Environment/Library/DOM/style"
import Prompt from "@Environment/Library/DOM/elements/prompt"
import EaseOutQuad from "@DOMPath/Animation/Library/Timing/easeOutQuad"
import EaseOutCubic from "@DOMPath/Animation/Library/Timing/easeOutCubic"
import Animation from "@DOMPath/Animation/Classes/Animation"

const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length

const app = (min, max) => Math.random() * (max - min) + min

const vocabulary = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(" ")

function randomString() {
    const length = Math.floor(app(100, 400))
    let string = ""
    for (let index = 1; index < length; index++) {
        string += `${vocabulary[Math.floor(app(0, vocabulary.length))]} `
    }

    return string
}

function randomRgba() {
    const o = Math.round; const r = Math.random; const
        s = 255
    return `rgba(${o(r() * s)},${o(r() * s)},${o(r() * s)},1)`
}

function randomBlock() {
    return new DOM({
        new: "div",
        content: randomString(),
        style: {
            padding: "10px",
            background: randomRgba(),
        },
    })
}

function randomContent() {
    const length = 4
    const cont = []
    for (let index = 1; index < length; index++) {
        cont.push(randomBlock())
    }

    return new DOM({
        new: "div",
        content: cont,
        style: {
            position: "fixed",
            top: "0",
        },
    })
}

export default function runGPUTest() {
    const c = new DOM({ new: "div" })
    let iframe

    async function test() {
        const realBody = iframe.elementParse.native.contentWindow.document.body
        const i = DOMObjectWrapper(realBody)

        realBody.style.background = Design.getVar("color-card-background")
        // realBody.style.overflow = "hidden"
        realBody.style.margin = "0"
        realBody.style.padding = "0"

        await Sleep(200)

        const tests = []

        const res = [...Array(3)].map(e => Array(0))


        let curScroll = 0
        const current = randomContent()
        const future = randomContent()
        const container = new DOM({
            new: "div",
            content: [
                current,
                future,
            ],
            style: {
                position: "relative",
                top: "0",
                left: "0",
                width: "100vw",
                height: "100vw",
                overflow: "auto",
            },
            onRender(ev, el) {
                el.elementParse.native.scrollTo(0, el.elementParse.native.scrollHeight)
                curScroll = el.elementParse.native.scrollHeight
            },
        })
        i.render(container)

        tests.push(new Animation({
            duration: 100,
            timingFunc: EaseOutQuad,
            painter(time) {
                res[2].push(performance.now())
                container.elementParse.native.scrollTop = Math.floor(curScroll * (1 - time))
            },
        }).apply(container))


        tests.push(new Animation({
            duration: 200,
            painter(time) {
                res[0].push(performance.now())
                this.style({
                    opacity: 1 - time,
                    transform: `scale(${1 + 0.05 * time})`,
                    zIndex: 0,
                })
            },
            timingFunc: EaseOutCubic,
        }).apply(current).then(() => current.destructSelf()))


        tests.push(new Animation({
            duration: 200,
            painter(time) {
                res[1].push(performance.now())
                this.style({
                    opacity: time,
                    transform: `scale(${1 - 0.05 * (1 - time)})`,
                })
            },
            timingFunc: EaseOutCubic,
        }).apply(future))

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
                new Padding("Temply runs a benchmark to test Advanced Window Transitions", 10),
            ),
            iframe,
        ],
    ))

    Prompt({
        title: "Benchmarking",
        text: c,
    })
}
