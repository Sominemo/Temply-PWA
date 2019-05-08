import DBTool from "../../tools/db/DBTool"
import FieldsContainer from "../../tools/validation/fieldsContainer"
import FieldChecker from "../../tools/validation/fieldChecker"
import TimestampToDays from "../../tools/time/timestampToDays"

export default class TimeManagementStorage {
    static connection = new DBTool("timeManagement", 1, {
        upgrade(db, oldVersion, newVersion, transaction) {
            if (oldVersion === 0) {
                db.createObjectStore("tasks", {
                    keyPath: "key",
                    autoIncrement: true,
                })
                db.createObjectStore("schedule", {
                    keyPath: "key",
                    autoIncrement: true,
                })
                db.createObjectStore("subjects", {
                    keyPath: "key",
                    autoIncrement: true,
                })
            }
        },
    })

    static async getAllLocations() {
        const r = await this.getAllSubjects()
        const t = await this.getAllTimetable()
        const p = [...r, ...t]
        const locations = p.map(e => e.cab).filter(e => e !== null)
        return [...new Set(locations)].sort((a, b) => {
            if (a.name < b.name) { return -1 }
            if (a.name > b.name) { return 1 }
            return 0
        })
    }

    static async updateDefaultLocation(subject, location = null) {
        const s = await this.getSubject(subject)
        if (!s) return false
        s.cab = (location === null ? null : String(location).substring(0, 10))
        return this.connection.OSTool("subjects").put(s)
    }

    static async newSubject({ name, cab = null, key = null }) {
        name = String(name).substring(0, 30)
        const os = this.connection.OSTool("subjects")
        const dub = await os.getWhere(null, e => e.name === name)
        if (dub.length !== 0 && dub[0].key !== key) return false
        const r = await os.put({ name, cab, ...(key ? { key } : {}) })
        return r
    }

    static async getSubject(key) {
        const os = this.connection.OSTool("subjects")
        const r = await os.get(key)
        return r
    }

    static async removeSubject(key) {
        const os = this.connection.OSTool("subjects")
        const r = await os.get(key)
        if (!r) return

        const t = (await this.getAllTimetable()).map((el) => {
            if (el.subject === key) return this.removeTimetableItem(el.key)
            return true
        })
        await Promise.all(t)

        await os.delete(key)
    }

    static async getAllSubjects() {
        const os = this.connection.OSTool("subjects")
        const r = await os.getAll()
        return r
    }

    static async getScheduleInDay(day, ...conditions) {
        const os = this.connection.OSTool("schedule")
        let r = await os.getWhereCombine(null, [e => e.day === day], conditions)
        r = r.sort((a, b) => {
            if (a.start < b.start) { return -1 }
            if (a.start > b.start) { return 1 }
            return 0
        })
        return r
    }

    static get todayWeekDay() {
        const js = new Date().getDay()
        return (js === 0 ? 7 : js)
    }

    static async getAllTimetable() {
        const os = this.connection.OSTool("schedule")
        return os.getAll()
    }

    static async checkTimetableCompatibility(day, start, end, current = null, getItems = false) {
        const collisionLookup = await this.getScheduleInDay(
            day,
            s => s.start <= start && s.end >= end && s.start < end && s.end > start,
            s => s.start <= start && s.end <= end && s.start < end && s.end > start,
            s => s.start >= start && s.end <= end && s.start < end && s.end > start,
            s => s.start >= start && s.end >= end && s.start < end && s.end > start,
            s => s.start === start && s.end === end && s.start < end && s.end > start,
        )

        if (collisionLookup.length > 0 && (current && collisionLookup[0].key !== current)) {
            return (getItems ? collisionLookup : false)
        }
        return true
    }

    static async newTimetableItem(data) {
        new FieldsContainer([
            ["subject", "day", "start", "end"],
            {
                key: new FieldChecker({ isInt: true }),
                subject: new FieldChecker({ isInt: true }),
                day: new FieldChecker({ isInt: true, range: [1, 7] }),
                start: new FieldChecker({ isInt: true, range: [0, 86400] }),
                end: new FieldChecker({ isInt: true, range: [0, 86400] }),
                cab: new FieldChecker({ max: 10 }),
            },
        ]).set(data)
        const {
            subject, day, start, end, cab, key,
        } = data
        const location = cab || null

        if (end - start > 86400 || start > end) throw new Error(1) // Incorrect time range
        if (!(await this.checkTimetableCompatibility(day, start, end, key))) {
            throw new Error(2) // Timetable collision conflict
        }

        const subjectObject = await this.getSubject(subject)

        if (!(subjectObject)) throw new Error(3) // Undefined subject

        try {
            const os = this.connection.OSTool("schedule")

            const tasks = []

            tasks.push(os.put({
                subject, day, start, end, cab: location, ...(key ? { key } : {}),
            }))
            if (subjectObject.cab === null && cab !== null && cab !== "") {
                tasks.push(this.updateDefaultLocation(subject, cab))
            }
            await Promise.all(tasks)
        } catch (e) {
            throw new Error(3) // Database I/O error
        }
    }

    static getTimetableItem(key) {
        const os = this.connection.OSTool("schedule")
        return os.get(key)
    }

    static removeTimetableItem(key) {
        const os = this.connection.OSTool("schedule")
        return os.delete(key)
    }

    static async getTasks(dayOffset = 0) {
        const os = this.connection.OSTool("tasks")
        const search = TimestampToDays() + dayOffset
        const tasks = await os.getWhere(null, e => e.day === search)
        return tasks.sort((a, b) => {
            if (a.day < b.day) { return -1 }
            if (a.day > b.day) { return 1 }
            return 0
        })
    }

    static async getTasksForDay(day) {
        const os = this.connection.OSTool("tasks")
        const tasks = await os.getWhere(null, e => e.day === day)
        return tasks.sort((a, b) => {
            if (a.day < b.day) { return -1 }
            if (a.day > b.day) { return 1 }
            return 0
        })
    }

    static async getAllTasks() {
        const os = this.connection.OSTool("tasks")
        const tasks = await os.getAll()
        return tasks.sort((a, b) => {
            if (a.day < b.day) { return -1 }
            if (a.day > b.day) { return 1 }
            return 0
        })
    }

    static async markTaskAs(key, state = true) {
        const os = this.connection.OSTool("tasks")
        const tasks = await os.get(key)
        tasks.state = state
        await os.put(tasks)
    }

    static async getTasksForSubject(key) {
        const subject = this.getSubject(key)
        if (!subject) return []

        const os = this.connection.OSTool("tasks")
        const tasks = await os.getWhere(null, e => e.subject === subject.key)
        return tasks.sort((a, b) => {
            if (a.day < b.day) { return -1 }
            if (a.day > b.day) { return 1 }
            return 0
        })
    }

    static getTask(key) {
        const os = this.connection.OSTool("tasks")
        return os.get(key)
    }

    static async addTask({
        content,
        title = "",
        day = null,
        subject = null,
    }) {
        if (!subject) return false

        if (title === "" && content.length <= 30) {
            title = content
            content = ""
        }
        const current = TimestampToDays()
        if (day < current) return false

        content = String(content)
        title = String(title)

        const subjectOBJ = this.getSubject(subject)
        if (!subjectOBJ) return false

        const os = this.connection.OSTool("tasks")
        const id = await os.add({
            content, title, day, subject,
        })
        return this.getTask(id)
    }

    static async FindNextSubjectClass(entryID = null, ignoreToday = true) {
        const timetable = (await this.getAllTimetable()).sort((a, b) => {
            if (a.start < b.start) { return -1 }
            if (a.start > b.start) { return 1 }
            return 0
        })

        const pos = timetable.findIndex(e => e.key === entryID)
        const current = timetable[pos]
        const nextThisWeek = timetable.findIndex((e, i) => i > pos
            && e.subject === current.subject
            && (!ignoreToday && this.todayWeekDay !== e.day))

        if (!nextThisWeek) return current
        return timetable[nextThisWeek]
    }
}
