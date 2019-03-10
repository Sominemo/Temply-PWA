import {
    Title, Columns, Preloader, Icon,
} from "../../../ui/DOM/Library/object"
import { VideoBlock, HTML } from "../../../ui/DOM/Library/basic"
import { SwitchLabel, Radio } from "../../../ui/DOM/Library/object/input"
import { Card, CardContent } from "../../../ui/DOM/Library/object/card"
import { $$ } from "../../Language/handler"
import { Algin, Padding } from "../../../ui/DOM/Library/style"
import DOM from "../../../ui/DOM/Classes/dom"
import SettingsStorage from "../SettingsStorage"
import DOMObjectWrapper from "../../../ui/DOM/Helpers/domObjectWrapper"
import App from "../../../main/app"

export default async function updatePopup({ wait = false, update = false } = {}) {
    let firstTime
    async function getCard() {
        const videos = [
            ["assets/animations/update-silently.webm", 4, "#e23163"],
            ["assets/animations/update-on-toast.webm", 2, "#4875d1"],
            ["assets/animations/update-on-popup.webm", 2.5, "#fbbf00"],
        ]

        const files = []

        async function getVid(url, time, color, i) {
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
            files[i] = video
        }

        await Promise.all(videos.map((a, i) => getVid(...a, i)))

        let updateType = await SettingsStorage.get("user_update_prompt")
        if (!(["silent", "toast", "popup"].includes(updateType))) updateType = "toast"
        firstTime = updateType === undefined
        if (update) SettingsStorage.set("user_update_prompt", updateType)

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
            ], {
                classFirst: ["column-video"],
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
        ])
    }

    if (wait) {
        const crd = new Card(new Algin(new Preloader(), ["center", "row"]));
        (async () => {
            const cnt = await getCard()
            crd.clear()
            crd.render(...cnt.object.content)
        })()
        return crd
    }

    if (!update) {
        const cnt = await getCard()
        return cnt
    }

    const output = []
    if (firstTime === undefined) firstTime = ((await SettingsStorage.get("user_update_prompt")) === undefined)

    if (firstTime) {
        output.push(new CardContent(
            $$("@settings/updates/first_time_explanation_1"),
        ))
        output.push(new CardContent(
            $$("@settings/updates/first_time_explanation_2"),
        ))
        output.push(await getCard())
    } else {
        const settingsWrap = new DOM({ new: "div" })
        output.push(new Algin(
            [
                new DOM({
                    new: "div",
                    class: ["inline-title-clickable"],
                    content: new Padding(new Title($$("@settings/updates/change_notify_way"), 3, {}, new Icon("arrow_forward",
                        {
                            marginRight: ".2em",
                            fontSize: "1.5em",
                        })), "0 10px"),
                    events: [
                        {
                            event: "click",
                            async handler() {
                                const e = settingsWrap
                                DOMObjectWrapper(this).clear()
                                const a = await updatePopup({ wait: true })
                                e.render(a)
                            },
                        },
                    ],
                }),
                settingsWrap,
            ], ["center", "row"],
        ))
    }
    output.push(new Title("Change Log", 2))
    output.push(new CardContent(new DOM({
        new: "div",
        style: {
            maxWidth: "100%",
            overflowX: "auto",
        },
        content: new HTML([`<div>${App.changelog}</div>`]),
    })))

    return output
}
