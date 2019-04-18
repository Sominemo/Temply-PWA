export default {
    tasks: {
        __index: "tasks",
        agenda: "your agenda",
        inbox: "inbox",
    },
    timetable: {
        __index: "timetable",
        defaults: "defaults",
        lesson_length: "lesson length",
        break_length: "break length",
        lesson_start: "lesson start",
    },
    recovery_mode: {
        __index: "Recovery Mode",
        enter: "restart to enter Recovery Mode",
        now: "Recovery Mode is activated",
        back_to_normal: "Restart the app without the special hash to leave it",
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
        locked_item: "Info: You can't commit changes there",
        skip_assets_loading: "skip assets loading",
        restart_to_apply: "restart to apply changes",
        language: "language",
        errors: {
            no_page: "there's no such settings page",
            layout_failed: "It seems like we failed to load Settings",
        },
        actions: {
            open_about: "open About screen",
            go_main: "go to main",
            restart: "restart",
        },
        general: {
            __index: "general",
            information: "information",
            welcome_alpha: "welcome to alpha-testing of Temply PWA",
        },
        storage: {
            __index: "storage",
            used: "used",
            of: "of",
            calculating: "calculating",
            dbs: {
                logs: {
                    __index: "logs",
                    description: "keeps general data about app functionality for debug if something wents wrong",
                },
            },
            actions: {
                clear: "clear",
                export: "export",
            },
        },
        updates: {
            __index: "updates",
            title: "update settings",
            description: `choose preferred behaviour for "New update" notification, so it can distract you less if you wish.
            Press the pictures to see how it acts`,
            first_time_explanation: "Temply works thanks to a technology called Progressive Web Apps.",
            learn_more_about_pwa: "Learn more about the impact of PWAs to the update process",
            pwa_support_link: "https://temply.procsec.top/help/article/en/what-is-pwa#pwa-role-in-update",
            change_notify_way: "show update settings",
            notify_later: "notify only after installing",
            ready: "new update is ready",
            installed: "new update just installed",
            tell_more: "tell more",
            later: "later",
            got_it: "got it",
            restart_now: "restart now",
            pending: "new update is pending",
            click_to_restart: "click the button to restart",
            restart: "restart",
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
        changelog: {
            __index: "changes",
            added: "added",
            changed: "changed",
            removed: "removed",
            other: "other",
        },
    },
    experiments: {
        __index: "experiments",
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
