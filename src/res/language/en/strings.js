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
        updates: {
            __index: "updates",
            title: "update settings",
            description: `choose preferred behaviour for "New update" notification, so it can distract you less if you wish.
            Press the pictures to see how it looks like`,
            first_time_explanation_1: `looks like it's first time you recieve an update. Temply is a web-based
            application. After first time you run it the app saves itself on your device so you don't have to
            spend your data by re-downloading it everytime you want to use Temply. In that time we are checking for new
            updates automatically and downloading them if we found such.`,
            first_time_explanation_2: `since it's web-based application we can do this only
            while it's on your screen. When the update is ready it waits to be aplied right after the app is being re-opened.
            We can inform you about this updates so you will know about changes and enchantments at first hand`,
            change_notify_way: "show updates settings",
            notify_later: "notify only after installing",
            ready: "new update is ready",
            types: {
                silently: {
                    __index: "silently",
                    info: `temply will do the job silently so you may discover the changes by yourself.
                    New updates are applying after restarting the app`,
                },
                toast: {
                    __index: "toast",
                    info: `when there will be an update you will see a small toast. By clicking it you will
                    get information about the update and can apply related actions`,
                },
                popup: {
                    __index: "popup",
                    info: `new update alert and changelog will pop up on your screen automatically
                    so you don't have to click anywhere`,
                },
            },
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
