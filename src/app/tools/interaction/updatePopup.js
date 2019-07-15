import { VideoBlock } from "@Environment/Library/DOM/basic"
import DOM from "@DOMPath/DOM/Classes/dom"
import { Radio, SwitchLabel, Button } from "@Environment/Library/DOM/object/input"
import { Title, Columns, Preloader } from "@Environment/Library/DOM/object"
import { $$ } from "@Core/Services/Language/handler"
import { CardContent, Card } from "@Environment/Library/DOM/object/card"
import { Align, Padding } from "@Environment/Library/DOM/style"
import SlideIn from "@Environment/Library/Animations/slideIn"
import IconSide from "@Environment/Library/DOM/object/iconSide"
import Toast from "@Environment/Library/DOM/elements/toast"
import DOMObjectWrapper from "@DOMPath/DOM/Helpers/domObjectWrapper"
import FadeOut from "@Environment/Library/Animations/fadeOut"
import WindowManager from "@Core/Services/SimpleWindowManager"
import TemplyApp from "@App/modules/main/TemplyApp"
import SettingsStorage from "../../../core/Services/Settings/SettingsStorage"

export default async function updatePopup({ wait = false, update = false, online = false } = {}) {
    let firstTime
    async function getCard({ noAssets = false } = {}) {
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
        if (!noAssets) {
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
                classFirst: ["column-video", ...(noAssets ? ["no-assets"] : [])],
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
        const crd = new Card(new Align(
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
                                        const cnt = await getCard({ noAssets: true })
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
            version: TemplyApp.version,
            date: TemplyApp.buildDate,
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
        output.push(new Align(versionTitle, ["center", "row"]))

        output.push(await getCard())
    } else {
        output.push(new Align(
            [
                new Padding([
                    versionTitle,
                    new Button({
                        content: new IconSide("arrow_forward", $$("@settings/updates/change_notify_way")),
                        type: ["small", "light"],
                        async handler() {
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
        content: (online !== false
            ? TemplyApp.changelogFormated(cl.changelog)
            : TemplyApp.changelogFormated()),
    })))

    output.push(new DOM({
        new: "div",
        class: "bottom-buttons",
        content: new Align([
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
