export default {
    tasks: {
        __index: "tasks",
        agenda: "your agenda",
        inbox: "inbox",
    },
    timetable: {
        __index: "timetable",
    },
    dateformats: {
        week: {
            __index: "week",
            days: {
                __index: "week days",
                su: "sunday",
                mo: "monday",
                tu: "tuesday",
                we: "wednesday",
                th: "thursday",
                fr: "friday",
                sa: "saturday",
            },
        },
        relative: {
            today: "today",
            yesterday: "yesterday",
            tomorrow: "tomorrow",
        },
    },
    settings: {
        __index: "settings",
        errors: {
            no_page: "there's no such settings page",
            layout_failed: "looks like we failed to load settings layout",
        },
        actions: {
            open_about: "open About screen",
            go_main: "go to main",
        },
        general: {
            __index: "general",
            information: "information",
            welcome_alpha: "welcome to alpha-testing of Temply PWA",
        },
    },
    about: {
        __index: "about",
        app: "about app",
        version: "version",
        build_date: "build date",
        branch: "branch",
        debug: "debug",
    },
    unexpected_error: "oops!",
}
