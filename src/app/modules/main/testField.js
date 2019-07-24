import SettingsStorage from "@Core/Services/Settings/SettingsStorage"
import Navigation from "@Core/Services/navigation"
import { WindowContainer } from "@Environment/Library/DOM/buildBlock"
import WindowManager from "@Core/Services/SimpleWindowManager"
import DOM from "@DOMPath/DOM/Classes/dom"
import FadeIn from "@Environment/Library/Animations/fadeIn"
import { Title } from "@Environment/Library/DOM/object"
import { Card, CardContent } from "@Environment/Library/DOM/object/card"
import {
    RadioLabel, Button, WidgetEditable, TextInput,
} from "@Environment/Library/DOM/object/input"
import { Align } from "@Environment/Library/DOM/style"
import FlyOut from "@Environment/Library/Animations/flyOut"
import EaseOutQuad from "@DOMPath/Animation/Library/Timing/easeOutQuad"
import FlyIn from "@Environment/Library/Animations/flyIn"
import BigNumberInput from "@Environment/Library/DOM/object/input/contentEditableWidgets/bigNumberInput"
import { $ } from "@Core/Services/Language/handler"
import TimeNumInput from "@Environment/Library/DOM/object/input/contentEditableWidgets/timeNumInput"
import IconSide from "@Environment/Library/DOM/object/iconSide"
import { ContextMenu } from "@Environment/Library/DOM/elements"
import runGPUTest from "@App/tools/interaction/GPUTests/2"
import Toast from "@Environment/Library/DOM/elements/toast"
import download from "@App/tools/interaction/download"
import FileInput from "@Environment/Library/DOM/object/input/fileInput"
import pFileReader from "@Core/Tools/objects/pFileReader"
import Prompt from "@Environment/Library/DOM/elements/prompt"
import errorToObject from "@Core/Tools/transformation/object/errorToObject"
import { CoreLoader } from "@Core/Init/CoreLoader"
import TimeManagementStorage from "../diary/storage/TimeManagementStorage"

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
                        Navigation.url = { module: "flags" }
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
            handler(e) {
                ContextMenu({
                    event: e,
                    content: [
                        {
                            icon: "opacity",
                            title: "General",
                            handler() { runGPUTest(1) },
                        },
                        {
                            icon: "open_in_browser",
                            title: "Advanced Window Transitions",
                            handler() { runGPUTest(2) },
                        },
                    ],
                })
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

CoreLoader.registerTask({
    id: "test_field_module",
    presence: "Test Field",
    task() {
        Navigation.addModule({
            name: "Test Field",
            id: "test",
            callback() { TestField.Init() },
        })
    },
})
