import WindowManager from "../../ui/SimpleWindowManager"
import { $$ } from "../../services/Language/handler"
import TimeManagementStorage from "../storage/TimeManagementStorage"
import DynamicListPopup from "../../ui/DOM/Library/object/input/dynamicListPopup"
import HistoryHints from "../../services/HistoryHints"
import Prompt from "../../ui/DOM/Library/elements/prompt"

export default function SubjectChooser(onChange = () => {}) {
    let subject
    DynamicListPopup({
        icon: "school",
        placeholder: $$("subject"),
        inputMax: 30,
        async onSelect(value) {
            if (typeof value === "string") {
                const id = await TimeManagementStorage
                    .newSubject({ name: value })
                value = await TimeManagementStorage.getSubject(id)
            }

            HistoryHints.saveHint("subjects", value.key)
            subject = value
            onChange(subject)
        },
        onContext(t, evt) {
            Prompt({
                title: $$("@timetable/edit/deletion"),
                text: $$("@timetable/edit/deletion_question"),
                buttons: [
                    {
                        content: $$("@timetable/edit/cancel"),
                        handler: "close",
                        type: ["light"],
                    },
                    {
                        content: $$("@timetable/edit/clear"),
                        handler() {
                            HistoryHints.clearByName("subjects")
                            WindowManager.closeAllOverlays()
                        },
                    },

                ],
            })
            evt.preventDefault()
        },
        list: async (query = "") => {
            const hintID = await HistoryHints.getHints("subjects")
            let subjects = (await TimeManagementStorage.getAllSubjects())
                .sort((a, b) => {
                    if (a.name < b.name) { return -1 }
                    if (a.name > b.name) { return 1 }
                    return 0
                })

            let hints = hintID.map((e) => {
                const r = subjects.findIndex(ep => ep.key === e)
                if (r === -1) return false
                return subjects.splice(r, 1)[0]
            }).filter(e => e !== false)

            hints = hints.map(e => ({
                name: e.name,
                value: e,
                icon: "history",
            }))

            subjects = subjects.map(e => ({
                name: e.name,
                value: e,
                icon: "school",
            }))

            let output = [...hints, ...subjects]

            if (query === "") {
                if (output.length === 0) {
                    return [{
                        name: $$("@timetable/edit/start_typing"),
                        icon: "more_horiz",
                    }]
                } return output
            }

            const upperQuery = query.toUpperCase()
            output = output.filter(
                e => e.name.toUpperCase().includes(upperQuery),
            )
            return [
                ...(output.find(e => e.name === query) ? [] : [{
                    name: query,
                    value: query,
                    icon: "add",
                    color: "var(--color-accent)",
                }]),
                ...output,
            ]
        },

    })
}
