import {
    Title, Columns, Preloader,
} from "../../../ui/DOM/Library/object"
import { VideoBlock } from "../../../ui/DOM/Library/basic"
import { SwitchLabel, Radio, Button } from "../../../ui/DOM/Library/object/input"
import { Card, CardContent } from "../../../ui/DOM/Library/object/card"
import { $$ } from "../../Language/handler"
import { Algin, Padding } from "../../../ui/DOM/Library/style"
import DOM from "../../../ui/DOM/Classes/dom"
import SettingsStorage from "../SettingsStorage"
import DOMObjectWrapper from "../../../ui/DOM/Helpers/domObjectWrapper"
import App from "../../../main/app"
import WindowManager from "../../../ui/SimpleWindowManager"
import FadeOut from "../../../ui/Animation/Library/Effects/fadeOut"
import IconSide from "../../../ui/DOM/Library/object/iconSide"
import Toast from "../../../ui/DOM/Library/elements/toast"
import SlideIn from "../../../ui/Animation/Library/Effects/slideIn"
import SlideOut from "../../../ui/Animation/Library/Effects/slideOut"

export default async function updatePopup({ wait = false, update = false, online = false } = {}) {
    let firstTime
    async function getCard({ noAsets = false } = {}) {
        const videos = [
            ["assets/animations/update-silently.webm", 4, "#e23163"],
            ["assets/animations/update-on-toast.webm", 2, "#4875d1"],
            ["assets/animations/update-on-popup.webm", 2.5, "#fbbf00"],
        ]

        async function getVid(url, time, color) {
            const video = await new VideoBlock(url, {
                onclick(v) {
                    if (v.paused) {
                        v.currentTime = 0
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
                    cursor: "pointer",
                },
                defaultTime: time,
            })
            return video
        }

        let files
        if (!noAsets) {
            files = await Promise.all(videos.map(a => getVid(...a)))
        } else {
            files = Array(videos.length).fill().map(() => new DOM({ new: "div" }))
        }

        let updateType = await SettingsStorage.get("user_update_prompt")
        if (!(["silent", "toast", "popup"].includes(updateType))) updateType = "toast"
        firstTime = updateType === undefined

        const radios = new Radio([
            {
                element: new DOM({
                    new: "div",
                    content: [
                        new DOM({
                            new: "div",
                            content: new Title($$("@settings/updates/types/silently"), 3, { margin: "5px auto 0" }),
                        }),
                        new CardContent($$("@settings/updates/types/silently/info")),
                    ],
                    style: { flex: "1" },
                }),
                handler(state) {
                    if (state === true) SettingsStorage.set("user_update_prompt", "silent")
                },
                selected: updateType === "silent",
            },
            {
                element: new DOM({
                    new: "div",
                    content: [
                        new DOM({
                            new: "div",
                            content: new Title($$("@settings/updates/types/toast"), 3, { margin: "5px auto 0" }),
                        }),
                        new CardContent($$("@settings/updates/types/toast/info")),
                    ],
                    style: { flex: "1" },
                }),
                handler(state) {
                    if (state === true) SettingsStorage.set("user_update_prompt", "toast")
                },
                selected: updateType === "toast",
            },
            {
                element: new DOM({
                    new: "div",
                    content: [
                        new DOM({
                            new: "div",
                            content: new Title($$("@settings/updates/types/popup"), 3, { margin: "5px auto 0" }),
                        }),
                        new CardContent($$("@settings/updates/types/popup/info")),
                    ],
                    style: { flex: "1" },
                }),
                handler(state) {
                    if (state === true) SettingsStorage.set("user_update_prompt", "popup")
                },
                selected: updateType === "popup",
            },
        ], "column-radio-chooser")

        let viewed = false

        return new Card([
            new Title($$("@settings/updates/title"), 3),
            new CardContent($$("@settings/updates/description")),
            new Columns([
                {
                    first: files[0],
                    last: radios[0],
                },
                {
                    first: files[1],
                    last: radios[1],
                },
                {
                    first: files[2],
                    last: radios[2],
                },
            ],
            {
                classFirst: ["column-video", ...(noAsets ? ["no-assets"] : [])],
                styleLast: { flex: "1", display: "flex" },
            }),
            new SwitchLabel(
                [
                    !!await SettingsStorage.get("user_update_prompt_later"),
                    (state) => {
                        SettingsStorage.set("user_update_prompt_later", !!state)
                    },
                ],
                $$("@settings/updates/notify_later"),
            ),
            new DOM({
                new: "div",
                style: {
                    display: "none",
                },
                onRender(p) {
                    if (viewed || (update && !p.asContent)) return
                    viewed = true
                    SettingsStorage.set("user_update_prompt", updateType)
                },
            }),
        ])
    }

    if (wait) {
        let rendered = false
        const crd = new Card(new Algin(
            new DOM({
                new: "div",
                content: [
                    new Preloader(),
                ],
                onRender(p, e) {
                    setTimeout(() => {
                        if (!p.asContent && !rendered) {
                            e.render(new DOM({
                                new: "div",
                                content: new Button({
                                    content: $$("@settings/skip_assets_loading"),
                                    type: ["small", "light", "generic"],
                                    async handler() {
                                        const cnt = await getCard({ noAsets: true })
                                        crd.clear()
                                        crd.render(...cnt.object.content)
                                        rendered = true
                                    },
                                }),
                                onRender(pr, el) {
                                    new SlideIn({ duration: 100 }).apply(el)
                                },
                            }))
                        }
                    }, 3000)
                },
            }),
            ["center", "row"],
        ));

        (async () => {
            const cnt = await getCard()
            crd.clear()
            crd.render(...cnt.object.content)
            rendered = true
        })()
        return crd
    }

    if (!update) {
        const cnt = await getCard()
        return cnt
    }

    const output = []
    if (firstTime === undefined) firstTime = ((await SettingsStorage.get("user_update_prompt")) === undefined)
    let cl

    if (online !== false) {
        cl = online
    } else {
        cl = {
            version: App.version,
            date: App.buildDate,
        }
    }

    const versionTitle = new Button({
        content: new IconSide("info", cl.version),
        type: ["small", "light", "generic"],
        handler() {
            Toast.add(cl.date)
        },
    })

    if (firstTime) {
        output.push(new Algin(versionTitle, ["center", "row"]))

        output.push(await getCard())
    } else {
        output.push(new Algin(
            [
                new Padding([
                    versionTitle,
                    new Button({
                        content: new IconSide("arrow_forward", $$("@settings/updates/change_notify_way")),
                        type: ["small", "light"],
                        async handler() {
                            console.log(this)
                            const e = DOMObjectWrapper(this.parentElement)
                            e.clear(await updatePopup({ wait: true }))
                        },
                        style: {
                            marginLeft: "10px",
                        },
                    }),
                ], "0 10px", { width: "100%" }),
            ], ["center", "row"],
        ))
    }

    output.push(new Title($$("@about/changelog"), 2))

    output.push(new CardContent(new DOM({
        new: "div",
        content: (online !== false ? App.changelogFormated(cl.changelog) : App.changelogFormated()),
    })))

    output.push(new DOM({
        new: "div",
        class: "bottom-buttons",
        content: new Algin([
            new Button({
                content: (online ? $$("@settings/updates/later") : $$("@settings/updates/got_it")),
                handler() {
                    new FadeOut({ duration: 200 })
                        .apply(
                            WindowManager.currentOverlay.element,
                        ).then(WindowManager.currentOverlay.pop)
                },
                ...(online ? { type: ["light"] } : {}),
            }),
            ...(online ? [new Button({ content: $$("@settings/updates/restart_now"), handler() { window.location.reload() } })] : []),
        ], ["center", "row"]),
    }))

    return output
}
