import WindowManager from "./ui/SimpleWindowManager"
import Popup from "./ui/DOM/Library/elements/popup"
import { Title, Columns } from "./ui/DOM/Library/object"
import { Algin } from "./ui/DOM/Library/style"
import DOM from "./ui/DOM/Classes/dom"
import { VideoBlock } from "./ui/DOM/Library/basic"
import { SwitchLabel } from "./ui/DOM/Library/object/input"

async function updatePopup() {
    const o = WindowManager.newOverlay()

    const videos = [
        ["assets/animations/update-silently.webm", 4, "#e23163"],
        ["assets/animations/update-on-popup.webm", 2.5, "#fbbf00"],
        ["assets/animations/update-on-toast.webm", 2, "#4875d1"],
    ]

    const files = []

    async function getVid(url, time, color, i) {
        const video = await new VideoBlock(url, {
            onclick(v) {
                if (v.paused) {
                    v.currentTime = 0
                    console.log(v, v.currentTime)
                    v.play()
                } else {
                    v.currentTime = time
                    v.pause()
                }
            },
            onended(v) {
                setTimeout(() => {
                    if (v.paused) v.currentTime = time
                }, 1000)
            },
            style: {
                width: "100%",
                background: color,
                display: "block",
            },
            defaultTime: time,
        })
        files[i] = video
    }

    await Promise.all(videos.map((a, i) => getVid(...a, i)))

    o.append(new Popup([
        new Algin(new Title("New update is ready", 2), ["center", "row"]),
        new Columns([
            {
                first: files[0],
                last: new DOM({ new: "div", style: { border: "solid 1px black", height: "100%" }, content: "wow" }),
            },
            {
                first: files[1],
                last: new DOM({ new: "div", style: { border: "solid 1px black", height: "100%" }, content: "wow" }),
            },
            {
                first: files[2],
                last: new DOM({ new: "div", style: { border: "solid 1px black", height: "100%" }, content: "wow" }),
            },
        ]),
        new SwitchLabel([false, () => {}], "Notificate only after installing"),
    ], { pop: o.pop, fullWidth: true }))
}

updatePopup()
console.log(updatePopup)
