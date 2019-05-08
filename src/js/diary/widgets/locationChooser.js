import WindowManager from "../../ui/SimpleWindowManager"
import { $$ } from "../../services/Language/handler"
import TimeManagementStorage from "../storage/TimeManagementStorage"
import DynamicListPopup from "../../ui/DOM/Library/object/input/dynamicListPopup"
import HistoryHints from "../../services/HistoryHints"
import Prompt from "../../ui/DOM/Library/elements/prompt"
import Design from "../../main/design"

export default function LocationChooser(onChange = () => { }, currentSubject = false) {
    let location
    DynamicListPopup({
        icon: "meeting_room",
        placeholder: $$("location"),
        inputMax: 10,
        async onSelect(value) {
            HistoryHints.saveHint("lesson-locations", value)
            location = value
            onChange(location)
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
                            HistoryHints.clearByName("lesson-locations")
                            WindowManager.closeAllOverlays()
                        },
                    },

                ],
            })
            evt.preventDefault()
        },
        list: async (query = "") => {
            const hintsID = await HistoryHints.getHints("lesson-locations")
            const locationsID = (await TimeManagementStorage.getAllLocations())

            const hints = hintsID.map(e => ({
                name: e,
                value: e,
                icon: "history",
            }))

            const locations = locationsID
                .filter(e => !hintsID.includes(e))
                .map(e => ({
                    name: e,
                    value: e,
                    icon: "meeting_room",
                }))

            let output = [...hints, ...locations]

            if (query === "") {
                const append = []

                if (currentSubject[0] && currentSubject[0].cab === null) {
                    append.push({
                        name: $$("@timetable/edit/new_subject_location"),
                        icon: "not_listed_location",
                    })
                }

                if (output.length === 0 && append.length === 0) {
                    append.push({
                        name: $$("@timetable/edit/start_typing"),
                        icon: "more_horiz",
                    })
                }

                return [...append, ...output]
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
                    color: Design.getVar("color-accent"),
                }]),
                ...output,
            ]
        },

    })
}
