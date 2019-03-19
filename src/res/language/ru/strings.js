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
        updates: {
            __index: "обновления",
            title: "настройки обновлений",
            description: `выберите предпочитетельное поведение для уведомлений о обновлениях.
            Нажмите на изображение, чтобы увидеть демонстрацию варианта`,
            first_time_explanation_1: `Temply это приложение,
            работающее на web-технологиях. Во время первого запуска приложение сохраняет само себя на Вашем устройстве, за счет чего
            экономится Интернет-трафик, так как данные не будут загружаться заново каждый раз как вы хотите воспользоваться Temply. 
            В это же время мы ищем и применяем новые обновления, если находим таковые.`,
            first_time_explanation_2: `так как это web-приложение, мы можем делать это только пока Temply находится
            на Вашем экране. После скачивания обновление ожидает перезапуска приложения, чтобы применить изменения.
            Мы можем уведомлять Вас об этих уведомлениях, чтобы Вы знали о изменениях и улучшениях из первых уст`,
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
