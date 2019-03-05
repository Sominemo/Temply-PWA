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
    expiriments: {
        __index: "expiriments",
        miscellaneous: "miscellaneous",
        warning: "warning",
        harmful_actions: `this features are experimental and some of them may cause problems, make the app unstable or break it at all.
        It's recommended to restart the application after commiting any changes.`,
        reload_page: "reload page",
        reset_flags: "reset flags",
        list: "list",
        no_exps_placeholder: "there's no experiments for you right now",
    },
    unexpected_error: "oops!",
}
