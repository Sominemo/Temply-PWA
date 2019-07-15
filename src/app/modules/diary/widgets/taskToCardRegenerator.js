import TimestampToDays from "@Core/Tools/time/timestampToDays"
import { $$ } from "@Core/Services/Language/handler"
import DateToString from "@Core/Tools/time/dateToString"
import TimeManagementStorage from "../storage/TimeManagementStorage"
import TaskCard from "./taskCard"

export default async function TaskToCardRegenerator(task) {
    const subject = await TimeManagementStorage.getSubject(task.subject)

    const current = TimestampToDays()
    const delta = subject.day - current
    let dateText

    if (delta === 0) dateText = $$("@dateformats/relative/today")
    else if (delta === 1) dateText = $$("@dateformats/relative/tomorrow")
    else if (delta === -1) dateText = $$("@dateformats/relative/yesterday")
    else {
        dateText = DateToString(new Date(subject.day * 86400000))
    }

    return new TaskCard({
        title: task.title,
        content: task.content,
        subject: subject.name,
        subjectKey: subject.key,
        taskKey: task.key,
        time: dateText,
    })
}
