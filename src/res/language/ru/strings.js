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
        locked_item: "Подсказка: Вы не можете вносить здесь изменения",
        skip_assets_loading: "пропустить загрузку ресурсов",
        restart_to_apply: "перегрузите для применения изменений",
        language: "язык",
        errors: {
            no_page: "такой страницы настроек нет",
            layout_failed: "похоже, у нас не вышло загрузить Настройки",
        },
        actions: {
            open_about: "о приложении",
            go_main: "на главную",
            restart: "перегрузить",
        },
        general: {
            __index: "общие",
            information: "информация",
            welcome_alpha: "добро пожаловать в предварительное тестирование Temply PWA",
        },
        storage: {
            __index: "хранилище",
            used: "использовано",
            of: "из",
            calculating: "расчет",
            dbs: {
                logs: {
                    __index: "отчеты",
                    description: "содержит основную информацию о работе приложения для отладки",
                },
            },
            actions: {
                clear: "очистить",
                export: "экспорт",
            },
        },
        updates: {
            __index: "обновления",
            title: "настройки обновлений",
            description: `выберите предпочитетельное поведение для уведомлений о обновлениях.
            Нажмите на изображение, чтобы увидеть демонстрацию варианта`,
            first_time_explanation: "Temply работает благодаря технологии Progressive Web Apps.",
            learn_more_about_pwa: "Узнайте больше о значении PWA для процесса обновления",
            pwa_support_link: "https://temply.procsec.top/help/article/ru/what-is-pwa#pwa-role-in-update",
            change_notify_way: "показать настройки обновлений",
            notify_later: "уведомлять только после установки",
            ready: "обновление уже здесь",
            installed: "обновление установлено",
            tell_more: "подробнее",
            later: "позже",
            got_it: "ясно",
            restart_now: "применить сейчас",
            pending: "обновление уже готово",
            click_to_restart: "нажмите на кнопку для установки",
            restart: "перегрузить",
            types: {
                silently: {
                    __index: "тихо",
                    info: `temply будет обновляться тихо и незаметно, Вы сможете узнавать о изменениях самостоятельно.
                    Обновления применяются после перезагрузки приложения`,
                },
                toast: {
                    __index: "подсказка",
                    info: `когда поступит обновление, Вы увидите небольшую подсказку. Нажав на нее Вы
                    получите информацию о обновлении и сможете предпринять соответствующие действия`,
                },
                popup: {
                    __index: "окно",
                    info: `уведомление о обновлении и список изменений появятся на вашем экране автоматически,
                    так что Вам не придется никуда нажимать`,
                },
            },
        },
    },
    about: {
        __index: "о",
        app: "о программе",
        version: "версия",
        build_date: "дата сборки",
        branch: "ветка",
        debug: "отладка",
        changelog: {
            __index: "список изменений",
            added: "добавлено",
            changed: "изменено",
            removed: "убрано",
            other: "прочее",
        },
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
        no_exps_placeholder: "сейчас тестировать нечего",
    },
    unexpected_error: "ой!",
}
