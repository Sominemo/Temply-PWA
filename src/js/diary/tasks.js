import Navigation from "../main/navigation"
import WindowContainer from "../ui/DOM/Library/buildBlock/windowContainer"
import { Nav } from "../ui/DOM/Library/buildBlock"
import WindowManager from "../ui/SimpleWindowManager"
import { Title, Icon } from "../ui/DOM/Library/object"
import { $$ } from "../services/Language/handler"
import TimeManagementStorage from "./storage/TimeManagementStorage"
import TaskToCardRegenerator from "./widgets/taskToCardRegenerator"
import Design from "../main/design"
import { CardContent, Card, CardTextList } from "../ui/DOM/Library/object/card"
import { Button, TextInput } from "../ui/DOM/Library/object/input"
import { Align } from "../ui/DOM/Library/style"
import { SettingsActLink } from "../ui/DOM/Library/settings"
import SubjectChooser from "./widgets/subjectChooser"
import DOM from "../ui/DOM/Classes/dom"
import IconSide from "../ui/DOM/Library/object/iconSide"
import DateInput from "../ui/DOM/Library/object/input/contentEditableWidgets/dateInput"
import DateToValue from "../tools/time/dateToValue"
import DaysToTimestamp from "../tools/time/DaysToTimestamp"
import TimestampToDays from "../tools/time/timestampToDays"
import ValueToDate from "../tools/time/ValueToDate"
import { InDevelopmentCard } from "../ui/DOM/Library/object/warnings"
import WarningConstructorButton from "../ui/DOM/Library/object/warnings/WarningConstructorButton"

Nav.newItem({
    name() { return $$("tasks") },
    icon: "assignment",
    id: "tasks",
    handler: () => {
        Navigation.hash = {
            module: "tasks",
            params: {},
        }
    },
})

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
                        Navigation.hash = {
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
                    handler() { Navigation.hash = { module: "tasks", params: ["edit"] } },
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
