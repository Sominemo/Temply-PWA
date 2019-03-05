export default {
    tasks: {
        __index: "задания",
        agenda: "повестка дня",
        inbox: "прочее",
    },
    timetable: {
        __index: "расписание",
    },
    dateformats: {
        week: {
            __index: "неделя",
            days: {
                __index: "дни недели",
                su: "воскресенье",
                mo: "понедельник",
                tu: "вторник",
                we: "среда",
                th: "четверг",
                fr: "пятница",
                sa: "суббота",
            },
        },
        relative: {
            today: "сегодня",
            yesterday: "вчера",
            tomorrow: "завтра",
        },
    },
    settings: {
        __index: "настройки",
        errors: {
            no_page: "такой страницы настроек нет",
            layout_failed: "похоже, у нас не вышло загрузить разветну настроек",
        },
        actions: {
            open_about: "о приложении",
            go_main: "на главную",
        },
        general: {
            __index: "общие",
            information: "информация",
            welcome_alpha: "добро пожаловать в предварительное тестирование Temply PWA",
        },
    },
    about: {
        __index: "о",
        app: "о программе",
        version: "версия",
        build_date: "дата сборки",
        branch: "ветка",
        debug: "отладка",
    },
    expiriments: {
        __index: "эксперименты",
        miscellaneous: "разное",
        warning: "предупреждение",
        harmful_actions: `эти опции экспериментальны и некоторые из них могут вызывать проблемы, нарушать стабильность приложения или вовсе препятствовать его работе.
        После внесения изменений стоит перегрузить приложение.`,
        reload_page: "перегрузить",
        reset_flags: "сбросить",
        list: "список",
    },
    unexpected_error: "ой!",
}
