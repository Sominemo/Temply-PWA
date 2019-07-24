import { Nav, WindowContainer } from "@Environment/Library/DOM/buildBlock"
import Navigation from "@Core/Services/navigation"
import { $$ } from "@Core/Services/Language/handler"
import { Title, Icon } from "@Environment/Library/DOM/object"
import { InDevelopmentCard } from "@Environment/Library/DOM/object/warnings"
import Design from "@Core/Services/design"
import WarningConstructorButton from "@Environment/Library/DOM/object/warnings/WarningConstructorButton"
import WindowManager from "@Core/Services/SimpleWindowManager"
import { CardContent, Card, CardTextList } from "@Environment/Library/DOM/object/card"
import DOM from "@DOMPath/DOM/Classes/dom"
import { TextInput, Button } from "@Environment/Library/DOM/object/input"
import DateInput from "@Environment/Library/DOM/object/input/contentEditableWidgets/dateInput"
import DateToValue from "@Core/Tools/time/dateToValue"
import DaysToTimestamp from "@Core/Tools/time/DaysToTimestamp"
import TimestampToDays from "@Core/Tools/time/timestampToDays"
import ValueToDate from "@Core/Tools/time/ValueToDate"
import { SettingsActLink } from "@Environment/Library/DOM/settings"
import IconSide from "@Environment/Library/DOM/object/iconSide"
import { Align } from "@Environment/Library/DOM/style"
import SettingsStorage from "@Core/Services/Settings/SettingsStorage"
import { CoreLoader, CoreLoaderSkip, CoreLoaderResult } from "@Core/Init/CoreLoader"
import SubjectChooser from "./widgets/subjectChooser"
import TaskToCardRegenerator from "./widgets/taskToCardRegenerator"
import TimeManagementStorage from "./storage/TimeManagementStorage"

export default class Tasks {
    static async Init() {
        if (Navigation.parse.params[0] === "edit") {
            this.InitEdit()
            return
        }

        const w = new WindowContainer()

        Navigation.Current = {
            navMenu: [
                {
                    icon: "archive",
                    title: "Archive",
                    handler() {
                        Navigation.url = {
                            module: "tasks",
                            params: ["all"],
                        }
                    },
                },
            ],
        }

        w.render(new Title($$("tasks")))
        w.render(new InDevelopmentCard())

        const today = await TimeManagementStorage.getTasks()
        const renderToday = await Promise.all(today.map(TaskToCardRegenerator))

        if (today.length) {
            w.render(
                new Title($$("@tasks/agenda"), 2,
                    {
                        marginLeft: `calc(30px - ${Design.getVar("size-icon-default")})`,
                    },
                    new Icon("flag", { color: Design.getVar("color-main"), marginRight: "5px" })),
            )
        }

        w.render(...renderToday)

        const tomorrow = await TimeManagementStorage.getTasks(1)
        const renderTomorrow = await Promise.all(tomorrow.map(TaskToCardRegenerator))

        if (tomorrow.length) {
            w.render(
                new Title($$("@tasks/inbox"), 2,
                    {
                        marginLeft: `calc(30px - ${Design.getVar("size-icon-default")})`,
                    },
                    new Icon("inbox", { color: Design.getVar("color-accent"), marginRight: "5px" })),
            )
        }

        w.render(...renderTomorrow)

        const allCount = today.length + tomorrow.length
        if (allCount === 0) {
            w.render(new WarningConstructorButton({
                type: 1,
                icon: "info",
                title: $$("@tasks/empty"),
                content: $$("@tasks/empty_description"),
                button: {
                    content: $$("@tasks/empty_fill_it"),
                    handler() { Navigation.url = { module: "tasks", params: ["edit"] } },
                },
            }))
        }

        WindowManager.newWindow().append(w)
    }

    static async InitEdit() {
        const entry = Navigation.parse.params[1] || false
        const editMode = !!entry
        let task = {}
        let subject = {}
        let ContentEdit
        let jumped = false
        let day

        const w = new WindowContainer()

        if (editMode) {
            task = await TimeManagementStorage.getTask(entry)
            subject = await TimeManagementStorage.getSubject(task.subject)
        }

        const card = new CardContent([])
        const cardCont = new Card(card)

        const subjectSignElement = new DOM({ new: "div", content: (editMode ? subject.name : $$("subject")) })

        const TitleEdit = new TextInput({

            set: {
                placeholder: "Title",
                maxLength: 30,
            },
            style: {
                fontFamily: Design.getVar("font-accent"),
                fontSize: "32px",
                boxShadow: "none",
            },
            events: [
                {
                    event: "keyup",
                    handler() {
                        const v = TitleEdit.currentValue
                        if (v.length < 30) return

                        TitleEdit.value = ""
                        ContentEdit.value = v
                        ContentEdit.elementParse.native.focus()
                        jumped = true
                    },
                },
            ],
        })

        ContentEdit = new TextInput({

            set: { placeholder: "Details" },
            style: {
                boxShadow: "none",
            },
            events: [
                {
                    event: "keyup",
                    handler() {
                        const v = ContentEdit.currentValue
                        if (v.length > 29) return
                        if (!jumped) return

                        TitleEdit.value = v
                        ContentEdit.value = ""
                        TitleEdit.elementParse.native.focus()
                        jumped = false
                    },
                },
                {
                    event: "input",
                    handler(ev, el) {
                        el.style({
                            height: "auto",
                        })
                        el.style({
                            height: `${el.elementParse.native.scrollHeight}px`,
                        })
                    },
                },
            ],
            params: {
                new: "textarea",
                onRender(ev, el) {
                    el.style({
                        height: `${el.elementParse.native.scrollHeight}px`,
                        overflowY: "hidden",
                    })
                },
            },
        })

        const saveButton = new Button({
            content: "Save",
            type: ["light"],
            async handler() {
                const titleString = TitleEdit.currentValue
                const contentString = ContentEdit.currentValue

                if (!(titleString.length > 0 && contentString.length > 0 && subject)) return

                task.title = titleString
                task.content = contentString
                task.subject = subject.key
            },
        })

        const dateInput = new DateInput({
            placeholder: "Date",
            content: (editMode
                ? DateToValue(DaysToTimestamp(day))
                : DateToValue(DaysToTimestamp(TimestampToDays() + 1))),
            onchange(n) {
                const s = ValueToDate(n)
                day = TimestampToDays(new Date(s[2], s[1], s[0]))
            },
        })

        const saveButtonAlign = new Align(saveButton, ["row", "center"])

        card.render(TitleEdit, ContentEdit, saveButtonAlign)

        w.render(new Title("New Task"))

        w.render(
            new Card(
                new CardTextList(
                    [
                        new SettingsActLink([(ev, el) => {
                            SubjectChooser(async (n) => {
                                let offset = 1
                                subjectSignElement.clear(n.name)
                                subject = n
                                const todayList = await TimeManagementStorage.getScheduleInDay(
                                    TimeManagementStorage.todayWeekDay,
                                )
                                const last = todayList[todayList.length - 1]
                                const next = await TimeManagementStorage
                                    .FindNextSubjectClass(last.key)
                                if (next.day === TimeManagementStorage.todayWeekDay) offset = 7
                                else if (next.day > TimeManagementStorage.todayWeekDay) {
                                    offset = next.day - TimeManagementStorage.todayWeekDay
                                } else offset = 7 + TimeManagementStorage.todayWeekDay - next.day
                                day = TimestampToDays() + offset
                            })
                        }, new IconSide(
                            "school",
                            subjectSignElement,
                            { style: { color: Design.getVar("color-accent"), marginRight: ".5em" } },
                        )]),
                    ],
                ),
            ),
        )

        w.render(new Card(new CardContent(
            dateInput,
        )))

        w.render(cardCont)

        WindowManager.newWindow().append(w)
    }
}

CoreLoader.registerTask({
    id: "tasks_module",
    presence: "Tasks",
    async task() {
        if (!(await (SettingsStorage.getFlag("tasks_enabled")))) return new CoreLoaderSkip()

        Navigation.addModule({
            name: "Tasks",
            id: "tasks",
            callback() { Tasks.Init() },
        })

        Nav.newItem({
            name() { return $$("tasks") },
            icon: "assignment",
            id: "tasks",
            handler: () => {
                Navigation.url = {
                    module: "tasks",
                    params: {},
                }
            },
        })

        return new CoreLoaderResult()
    },
})
