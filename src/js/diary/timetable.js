import Navigation from "../main/navigation"
import WindowContainer from "../ui/DOM/Library/buildBlock/windowContainer"
import { Nav } from "../ui/DOM/Library/buildBlock"
import WindowManager from "../ui/SimpleWindowManager"
import {
    Card, CardTextList, CardList, CardContent,
} from "../ui/DOM/Library/object/card"
import {
    Title, TwoSidesMobileFlick, Icon, TwoSidesWrapper,
} from "../ui/DOM/Library/object"
import { $$, $ } from "../services/Language/handler"
import IconSide from "../ui/DOM/Library/object/iconSide"
import { SettingsActLink } from "../ui/DOM/Library/settings"
import TimeManagementStorage from "./storage/TimeManagementStorage"
import DOM from "../ui/DOM/Classes/dom"
import SubjectChooser from "./widgets/subjectChooser"
import TimeToDigital from "../tools/transformation/text/TimeToDigital"
import SecondsToTime from "../tools/transformation/text/SecondsToTime"
import SettingsStorage from "../services/Settings/SettingsStorage"
import timeToSeconds from "../tools/transformation/text/timeToSeconds"
import TimeNumInput from "../ui/DOM/Library/object/input/contentEditableWidgets/timeNumInput"
import BigNumberInput from "../ui/DOM/Library/object/input/contentEditableWidgets/bigNumberInput"
import { ContentEditable, Button } from "../ui/DOM/Library/object/input"
import AlignedContent from "../ui/DOM/Library/object/AlignedContent"
import Design from "../main/design"
import LocationChooser from "./widgets/locationChooser"
import Prompt from "../ui/DOM/Library/elements/prompt"
import { Align } from "../ui/DOM/Library/style"
import Report from "../main/report"
import Toast from "../ui/DOM/Library/elements/toast"
import { ContextMenu } from "../ui/DOM/Library/elements"
import SlideOut from "../ui/Animation/Library/Effects/slideOut"
import EaseInOutQuad from "../ui/Animation/Library/Timing/easeInOutQuad"

Nav.newItem({
    name() { return $$("timetable") },
    icon: "schedule",
    id: "timetable",
    handler: () => {
        Navigation.hash = {
            module: "timetable",
            params: {},
        }
    },
})

export default class Timetable {
    static async Init() {
        const { parse } = Navigation
        if (parse.params[0] === "editor") {
            this.InitEdit(parse.params[1], parse.params[2])
            return
        }

        const editMode = (parse.params[0] === "edit")

        Navigation.Current = {
            navMenu: [

                (editMode
                    ? {
                        icon: "done",
                        title: $$("@timetable/edit/mode_exit"),
                        handler() {
                            Navigation.hash = { module: "timetable" }
                        },
                    }
                    : {
                        icon: "edit",
                        title: $$("@timetable/edit/mode"),
                        handler() {
                            Navigation.hash = { module: "timetable", params: ["edit"] }
                        },
                    }

                ),
            ],
        }

        const w = new WindowContainer()
        const date = new Date()
        let countEmpty = 0

        const curWeekday = (date.getDay() === 0 ? 7 : date.getDay())

        async function generateDay(day) {
            const cont = new DOM({ new: "div" })

            cont.render(new Title((curWeekday === day && !editMode ? $$("@dateformats/relative/today") : $$(`@dateformats/week/days/${day}`))))
            const timetable = await TimeManagementStorage.getScheduleInDay(day)
            const list = []
            const tasks = timetable.map(async (rec, n) => {
                const sub = await TimeManagementStorage.getSubject(rec.subject)
                if (!sub) return
                const item = new CardContent(
                    new TwoSidesWrapper(
                        new DOM({
                            new: "div",
                            content: [
                                new DOM({
                                    new: "div",
                                    style: {
                                        display: "inline-block",
                                        minWidth: "24px",
                                        textAlign: "center",
                                        marginRight: "15px",
                                        color: Design.getVar("color-generic-light-a"),
                                    },
                                    content: `${n + 1}`,
                                }),
                                sub.name,
                            ],
                        }),
                        (rec.cab === null ? "" : rec.cab),
                    ),
                )
                list.push({
                    content: item,
                    ...(editMode ? {
                        handler(ev) {
                            ContextMenu({
                                event: ev,
                                content: [
                                    {
                                        icon: "edit",
                                        title: $$("@timetable/edit/edit_item"),
                                        handler() {
                                            Navigation.hash = {
                                                module: "timetable",
                                                params: [
                                                    "editor",
                                                    day,
                                                    rec.key,
                                                ],
                                            }
                                        },
                                    },
                                    {
                                        icon: "delete",
                                        title: $$("@timetable/edit/del_item"),
                                        async handler() {
                                            try {
                                                await TimeManagementStorage
                                                    .removeTimetableItem(rec.key)
                                                Toast.add($$("@timetable/edit/removed"))
                                                await new SlideOut({
                                                    duration: 150,
                                                    timing: EaseInOutQuad,
                                                }).apply(item)
                                                console.log(item)
                                                item.elementParse.native.parentElement.parentElement
                                                    .removeChild(
                                                        item.elementParse.native.parentElement,
                                                    )
                                            } catch (e) {
                                                Toast.add($$("@timetable/edit/remove_fail"))
                                            }
                                        },
                                    },
                                ],
                            })
                        },
                    } : {}),
                })
            })
            await Promise.all(tasks)

            if (editMode) {
                list.push({
                    content: new CardContent(
                        new IconSide(
                            "add",
                            $$("@timetable/edit/add_item"),
                            { style: { color: Design.getVar("color-accent"), marginRight: "15px" } },
                        ),
                    ),
                    handler() {
                        Navigation.hash = {
                            module: "timetable",
                            params: [
                                "editor",
                                day,
                            ],
                        }
                    },
                })
            }

            if (list.length === 0) {
                countEmpty++
                return null
            }

            cont.render(new Card(new CardList(list)))

            return cont
        }

        const cards = Array.from({ length: 7 }, (v, k) => k + 1).map(n => generateDay(n))
        const cardsResult = await Promise.all(cards)
        cardsResult.forEach(e => w.render(e))

        if (countEmpty === 7) {
            w.render(new Title($$("timetable")))
            w.render(new Card(new CardContent(
                new TwoSidesMobileFlick(
                    new AlignedContent([
                        new Icon("info", {
                            margin: "5px",
                            marginRight: "15px",
                            fontSize: "32px",
                            color: Design.getVar("color-main"),
                        }),
                        [
                            new Title($$("@timetable/empty"), 2, { marginLeft: 0, marginTop: 0 }),
                            $$("@timetable/empty_description"),
                        ],
                    ]),
                    new Button({
                        content: $$("@timetable/empty_fill_it"),
                        handler() {
                            Navigation.hash = {
                                module: "timetable",
                                params: [
                                    "edit",
                                ],
                            }
                        },
                    }),
                ),
            ), { type: ["main-highlight"] }))
        }

        WindowManager.newWindow().append(w)
    }

    // EDITOR

    static async InitEdit(weekday = 1, item = null) {
        const db = TimeManagementStorage
        item = parseInt(item, 10) || 0
        weekday = parseInt(weekday, 10) || 1
        if (weekday < 1 || weekday > 7) weekday = 1

        const w = new WindowContainer()

        const itemObject = (item > 0 ? await db.getTimetableItem(item) : false)
        const editMode = !!itemObject
        if (editMode) weekday = itemObject.day

        w.render(new Title((editMode ? $$("@timetable/edit/edit_entry") : $$("@timetable/edit/new_entry"))))

        const warningContent = new DOM({ new: "span" })
        const warningCard = new Card(new CardContent(
            new TwoSidesMobileFlick(
                new AlignedContent([
                    new Icon("warning", {
                        margin: "5px",
                        marginRight: "15px",
                        fontSize: "32px",
                        color: Design.getVar("color-warning-info"),
                    }),
                    [
                        new Title($$("@timetable/edit/warning"), 2, { marginLeft: 0, marginTop: 0 }),
                        warningContent,
                    ],
                ]),
            ),
        ), { style: { display: "none" }, type: ["warn-highlight"] })

        function showWarning(warning = null) {
            if (warning === null) {
                warningCard.style({ display: "none" })
                return
            }
            warningContent.clear(warning)
            warningCard.style({ display: "" })
        }

        let subject = null
        let location = null
        let manualSelection = false
        let lessonLength
        let lessonEnd

        let lessonStart
        const lessonsStart = await SettingsStorage.get("timetable_lesson_default_start")
        const breakLength = await SettingsStorage.get("timetable_break_default_length")

        if (!editMode) {
            let lastLesson = await TimeManagementStorage.getScheduleInDay(weekday)

            if (lastLesson.length === 0) lastLesson = null
            else lastLesson = lastLesson[lastLesson.length - 1].end
            if (lastLesson !== null) {
                lessonStart = lastLesson + breakLength * 60
            } else {
                lessonStart = lessonsStart
            }

            lessonLength = await SettingsStorage.get("timetable_lesson_default_length")
            lessonEnd = lessonStart + lessonLength * 60
        } else {
            lessonLength = Math.floor((itemObject.end - itemObject.start) / 60)
            lessonStart = itemObject.start
            lessonEnd = itemObject.end
            subject = await TimeManagementStorage.getSubject(itemObject.subject)
            location = itemObject.cab
        }

        if (lessonStart > 86400) lessonStart = 0

        const subjectSignElement = new DOM({ new: "div", content: (subject ? subject.name : $$("subject")) })
        const locationSignElement = new DOM({ new: "div", content: (location || $$("location")) })


        let jumpdays = 0
        const calculatedEndContent = new DOM({ new: "span" })

        async function updateLocation() {
            if (manualSelection !== false || subject.cab === null) return

            const cab = String(subject.cab)
            location = cab
            locationSignElement.clear(cab)
        }

        function recalculateEnd() {
            jumpdays = 0
            lessonEnd = lessonStart + lessonLength * 60
            if (lessonEnd >= 86400) {
                while (lessonEnd >= 86400) {
                    jumpdays++
                    lessonEnd -= 86400
                }
            }
            calculatedEndContent.clear(TimeToDigital(SecondsToTime(lessonEnd)))
            if (jumpdays === 0) {
                showWarning()
            } else if (jumpdays === 1) {
                showWarning($$("@timetable/edit/dayjump"))
            } else if (jumpdays > 1) {
                showWarning($$("@timetable/edit/dayjump_big"))
            }
        }

        recalculateEnd()

        const calculatedEnd = new DOM({
            new: "div",
            content: [
                calculatedEndContent,
                new DOM({
                    new: "span",
                    style: { opacity: "0.5" },
                    content: ` ${$$("@timetable/edit/calculated")}`,
                }),
            ],
        })

        async function save() {
            if (!subject) return

            const candidates = []
            if (jumpdays > 0) {
                candidates.push({
                    day: weekday,
                    start: lessonStart,
                    end: 86400,
                })
                candidates.push({
                    day: (weekday === 7 ? 1 : weekday + 1),
                    start: 0,
                    end: lessonEnd,
                })
            } else {
                candidates.push({
                    day: weekday,
                    start: lessonStart,
                    end: lessonEnd,
                })
            }

            const res = await Promise.all(candidates.map(async (candidate, num) => {
                try {
                    await TimeManagementStorage.newTimetableItem({
                        subject: subject.key,
                        day: candidate.day,
                        start: candidate.start,
                        end: candidate.end,
                        cab: (location ? String(location).substring(0, 10) : null),
                        ...(editMode && num === 0 ? { key: itemObject.key } : {}),
                    })
                } catch (e) {
                    const m = e.message
                    let text = $$("@timetable/edit/creation_errors/unknown")

                    if (m === "1") {
                        text = $$("@timetable/edit/creation_errors/range")
                    } else
                    if (m === "2") {
                        text = $$("@timetable/edit/creation_errors/conflict")
                    } else
                    if (m === "3") {
                        text = $$("@timetable/edit/creation_errors/db")
                    } else {
                        Report.write("Subject save error", e)
                    }

                    Prompt({
                        title: $$("@timetable/edit/error"),
                        text: $$("@timetable/edit/creation_error", { replace: { error: text, num: num + 1 } }),
                        buttons: [
                            {
                                content: $$("@timetable/edit/close"),
                                handler: "close",
                            },
                        ],
                    })
                    return false
                }

                return true
            }))

            if (res.every(e => e)) {
                Toast.add($$("@timetable/edit/success"))
                Navigation.hash = {
                    module: "timetable",
                    params: [
                        "edit",
                    ],
                }
            }
        }

        w.render(
            new Card(
                new CardTextList(
                    [
                        new SettingsActLink([(ev, el) => {
                            SubjectChooser((n) => {
                                subjectSignElement.clear(n.name)
                                subject = n
                                updateLocation()
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

        w.render(new Title($$("@timetable/edit/details"), 2))
        w.render(
            new Card(
                new CardList(
                    [
                        {
                            content: new IconSide(
                                "notifications_active",
                                new TimeNumInput({
                                    placeholder: $$("@timetable/lesson_start"),
                                    content: TimeToDigital(SecondsToTime(lessonStart)),
                                    async onchange(n) {
                                        n = timeToSeconds(n)
                                        n = parseInt(n, 10)
                                        if (n < 0 || n > 86400) n = lessonStart
                                        lessonStart = n
                                        recalculateEnd()
                                    },
                                }),
                                {
                                    style: { color: Design.getVar("color-accent") },
                                    contentStyle: { width: "100%" },
                                },
                            ),
                        },
                        {
                            content: new IconSide(
                                "hourglass_empty",
                                new BigNumberInput(
                                    {
                                        units: num => $("@units/min", { number: num }),
                                        placeholder: $$("@timetable/lesson_length"),
                                        content: lessonLength,
                                        max: 1440,
                                        async onchange(n) {
                                            n = parseInt(n, 10)
                                            if (n < 0 || n > 1440) n = lessonLength
                                            lessonLength = n
                                            recalculateEnd()
                                        },
                                    },
                                ),
                                {
                                    style: { color: Design.getVar("color-accent") },
                                    contentStyle: { width: "100%" },
                                },
                            ),
                        },
                        {
                            content: new IconSide(
                                "info",
                                new ContentEditable({
                                    placeholder: $$("@timetable/lesson_end"),
                                    editable: false,
                                    content: calculatedEnd,
                                    transformString: false,
                                    style: {
                                        boxShadow: "none",
                                    },
                                    contentStyle: {
                                        minHeight: "auto",
                                        paddingBottom: "0",
                                    },
                                }),
                                {
                                    contentStyle: { width: "100%" },
                                },
                            ),
                            style: { background: Design.getVar("color-accent"), color: "white" },
                            classes: ["white-input-container"],
                        },
                    ], true,
                ),
            ),
        )

        w.render(warningCard)

        w.render(
            new Card(
                new CardTextList(
                    [
                        new SettingsActLink([(ev, el) => {
                            LocationChooser((n) => {
                                locationSignElement.clear(n)
                                location = n
                                manualSelection = true
                            }, [subject])
                        }, new IconSide(
                            "meeting_room",
                            locationSignElement,
                            { style: { color: Design.getVar("color-accent"), marginRight: ".5em" } },
                        )]),
                    ],
                ),
            ),
        )
        w.render(new Align(new Button({
            content: new IconSide("done", $$("done")),
            type: ["accent"],
            style: {
                marginLeft: "auto",
                marginRight: "auto",
                borderRadius: "2em",
            },
            handler: save,
        }), ["row", "center"]))

        WindowManager.newWindow().append(w)
    }
}
