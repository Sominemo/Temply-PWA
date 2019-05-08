import { Title } from "../ui/DOM/Library/object"
import WindowManager from "../ui/SimpleWindowManager"
import { WindowContainer } from "../ui/DOM/Library/buildBlock"
import { Align } from "../ui/DOM/Library/style"
import RadioLabel from "../ui/DOM/Library/object/input/radioLabel"
import { Card, CardContent } from "../ui/DOM/Library/object/card"
import SettingsStorage from "../services/Settings/SettingsStorage"
import DOM from "../ui/DOM/Classes/dom"
import FadeIn from "../ui/Animation/Library/Effects/fadeIn"
import { Button, TextInput } from "../ui/DOM/Library/object/input"
import FlyIn from "../ui/Animation/Library/Effects/flyIn"
import FlyOut from "../ui/Animation/Library/Effects/flyOut"
import EaseOutQuad from "../ui/Animation/Library/Timing/easeOutQuad"
import Toast from "../ui/DOM/Library/elements/toast"
import IconSide from "../ui/DOM/Library/object/iconSide"
import { ContextMenu } from "../ui/DOM/Library/elements"
import Navigation from "./navigation"
import WidgetEditable from "../ui/DOM/Library/object/input/widgetEditable"
import BigNumberInput from "../ui/DOM/Library/object/input/contentEditableWidgets/bigNumberInput"
import { $ } from "../services/Language/handler"
import TimeNumInput from "../ui/DOM/Library/object/input/contentEditableWidgets/timeNumInput"
import FileInput from "../ui/DOM/Library/object/input/fileInput"
import TimeManagementStorage from "../diary/storage/TimeManagementStorage"
import download from "../tools/interaction/download"
import errorToObject from "../tools/transformation/object/errorToObject"
import Prompt from "../ui/DOM/Library/elements/prompt"
import pFileReader from "../tools/objects/pFileReader"
import runGPUTest from "../tools/interaction/runGPUTest"

export default class TestField {
    static async Init() {
        const testEnabled = !!await SettingsStorage.getFlag("test_field_enabled")
        if (!testEnabled) throw new Error("Test Field is disabled")

        Navigation.Current = {
            navMenu: [
                {
                    icon: "outlined_flag",
                    title: "Experiments",
                    handler() {
                        Navigation.hash = { module: "flags" }
                    },
                },
            ],
        }

        const w = new WindowContainer()
        WindowManager.newWindow().append(w)

        const animational = new DOM({
            new: "div",
            onRender: (p, e) => {
                new FadeIn().apply(e)
            },
            content: new Title("Test Field"),
        })

        w.render(animational)

        let animDirection = "bottom"
        let state = true

        w.render(new Card([
            ...new RadioLabel([
                { handler: (s) => { if (s) animDirection = "bottom" }, selected: true, content: "Bottom" },
                { handler: (s) => { if (s) animDirection = "top" }, content: "Top" },
                { handler: (s) => { if (s) animDirection = "right" }, content: "Right" },
                { handler: (s) => { if (s) animDirection = "left" }, content: "Left" },
            ]),
            new Align(new Button({
                content: "Animate title",
                handler() {
                    if (state) {
                        new FlyOut({ direction: animDirection, timing: EaseOutQuad })
                            .apply(animational)
                    } else {
                        new FlyIn({ direction: animDirection, timing: EaseOutQuad })
                            .apply(animational)
                    }
                    state = !state
                },
            }), ["center", "row"]),
        ]))

        w.render(new Card(
            new CardContent([
                new WidgetEditable({
                    builder(input, ip) {
                        return [
                            new DOM({
                                new: "div",
                                content: "Set LMAO",
                                style: {
                                    margin: "10px",
                                    whiteSpace: "nowrap",
                                },
                                events: [
                                    {
                                        event: "click",
                                        handler() {
                                            input.emitEvent("editValue", { content: "LMAO" })
                                            ip().emitEvent("contextMenuClose")
                                        },
                                    },
                                ],
                            }),
                            new DOM({
                                new: "div",
                                content: "Set WTF",
                                style: {
                                    margin: "10px",
                                    whiteSpace: "nowrap",
                                },
                                events: [
                                    {
                                        event: "click",
                                        handler() {
                                            input.emitEvent("editValue", { content: "WTF" })
                                            ip().emitEvent("contextMenuClose")
                                        },
                                    },
                                ],
                            }),
                            new DOM({
                                new: "div",
                                content: "Clear",
                                style: {
                                    margin: "10px",
                                    whiteSpace: "nowrap",
                                },
                                events: [
                                    {
                                        event: "click",
                                        handler() {
                                            input.emitEvent("editValue", { content: "" })
                                            ip().emitEvent("contextMenuClose")
                                        },
                                    },
                                ],
                            }),
                        ]
                    },
                }),

                new BigNumberInput(
                    {
                        units: num => $("@units/min", { number: num }),
                        placeholder: "Duration",
                        max: 1440,
                    },
                ),
                new TimeNumInput({
                    placeholder: "Test",
                    value: "09:03",
                }),
                new TextInput({
                    set: {
                        value: "1",
                        placeholder: "Lmao",
                    },
                }),
            ]),
        ))

        w.render(new Button({
            content: new IconSide("motorcycle", "Graphical Test"),
            type: ["small", "light"],
            handler() {
                runGPUTest()
            },
        }))

        w.render(new Button({
            content: new IconSide("more", "Additional options"),
            type: ["small", "light", "accent"],
            style: {
                marginLeft: "10px",
            },
            eventType: "contextmenu",
            handler(e) {
                ContextMenu({
                    event: e,
                    content: [
                        {
                            icon: "schedule",
                            title: "Schedule",
                        },
                        {
                            type: "delimeter",
                        },
                        {
                            title: "Inspect",
                            handler() {
                                Toast.add("Nothing to inspect :P")
                            },
                        },
                        {
                            type: "delimeter",
                        },
                        {
                            icon: "more",
                            title: "Other stuff",
                        },
                        {
                            icon: "settings",
                            title: "Settings",
                        },
                    ],
                })
            },
        }))

        w.render(
            new Card([
                new Title("Import/Export", 3),
                new Button({
                    content: "Export",
                    async handler() {
                        const db = TimeManagementStorage.connection
                        const sub = await db.OSTool("subjects").getAll()
                        const sch = await db.OSTool("schedule").getAll()

                        download([JSON.stringify([sub, sch])], "text/plain", "export.json")
                    },
                    type: ["light"],
                    style: {
                        display: "block",
                        margin: "15px",
                        textAlign: "center",
                    },
                }),
                new FileInput({
                    async onchange(file) {
                        try {
                            const data = JSON.parse(await pFileReader(file))

                            const subDB = TimeManagementStorage.connection.OSTool("subjects")
                            const schDB = TimeManagementStorage.connection.OSTool("schedule")

                            await subDB.clear()
                            await Promise.all(
                                [
                                    ...data[0].map(sub => subDB.put(sub)),
                                    ...data[1].map(sub => schDB.put(sub)),
                                ],
                            )
                            Toast.add("Imported")
                        } catch (e) {
                            Toast.add("Import fail")
                            Prompt({
                                text: JSON.stringify(errorToObject(e)),
                            })
                        }
                    },
                }),
            ]),
        )

        // Toast.add("Just a test", 5000)
        // Toast.add("I'm kinda fast!", 500)
    }
}
