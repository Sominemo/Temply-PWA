export default {
    tasks: {
        __index: "задания",
        agenda: "повестка дня",
        inbox: "прочее",
    },
    timetable: {
        __index: "расписание",
        defaults: "умолчания",
        hint: "подсказка",
        where_to_control: "вы можете импортировать и экспортировать расписание в настройках хранилища",
        check_out: "перейти",
        time_management_settings: "настройки расписания",
        how_to_create_subjects: "вы можете создавать предметы при заполнении расписания",
        lesson_length: "длина занятия",
        break_length: "длина перерыва",
        lesson_start: "начало занятия",
        lessons_start: "начало занятий",
        lesson_end: "конец занятия",
        empty: "расписание не заполнено",
        empty_description: "новосозданные элементы будут появляться здесь",
        empty_fill_it: "заполнить",
        edit: {
            mode: "редактировать",
            add_item: "добавить",
            edit_item: "изменить",
            del_item: "удалить",
            mode_exit: "покинуть редактор",
            edit_entry: "редактирование",
            new_entry: "добавление",
            deletion: "очистка",
            deletion_question: "вы уверены, что хотите очистить список последних использованных предметов?",
            delete_subject_warning: "это также удалит все связанные элементы, помимо заметок",
            cancel: "отмена",
            clear: "очистить",
            start_typing: "просто печатайте...",
            details: "место в расписании",
            calculated: "– Высчитано",
            warning: "внимание",
            dayjump: "конец занятия переходит на следующий день, поэтому мы создадим несколько записей, если не будет конфликтов",
            dayjump_big: "указанный промежуток времени не поддерживается",
            new_subject_location: "похоже, вы только что создали новый предмет. Мы используем введенное вами здесь местоположение как местоположение по умолчанию для данного предмета",
            creation_errors: {
                unknown: "неизвестная ошибка",
                range: "неверный промежуток времени",
                conflict: "конфликт с уже существующими записями",
                db: "ошибка записи в базу данных",
            },
            creation_error: { type: "func", name: "replace", data: "{%error}. Запись №{%num} не была создана" },
            close: "закрыть",
            error: "ошибка",
            success: "сохранено",
            removed: "удалено",
            remove_fail: "ошибка при удалении",
            subject_exists: "предмет с таким названием уже существует",
        },
    },
    recovery_mode: {
        __index: "Аварийный режим",
        enter: "перезапустите приложение для входа в Аварийный режим",
        now: "Аварийный режим активен",
        back_to_normal: "Перезапустите приложение без специального хеша, чтобы покинуть его",
        idb_fail: {
            warning: "внимание",
            description: "у Temply возникли трудности при попытке использования хранилища браузера. Используйте Google Chrome или Mozilla Firefox",
            dl_chrome: "загрузить Chrome",
            dl_ff: "загрузить Firefox",
        },
    },
    units: {
        min: {
            type: "func",
            name: "plural",
            data: ["минута", "минуты", "минут"],
        },
    },
    dateformats: {
        week: {
            __index: "неделя",
            days: {
                __index: "дни недели",
                7: "воскресенье",
                1: "понедельник",
                2: "вторник",
                3: "среда",
                4: "четверг",
                5: "пятница",
                6: "суббота",
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
        appearance: {
            __index: "внешний вид",
            themes: {
                __index: "темы",
                system_theme_info: "на основе настроек системы",
                names: {
                    system: "системная",
                    default: "стандартная",
                    dark: "темная",
                },
            },
            window_transition: "переходы",
            animations: {
                optimized: {
                    __index: "оптимизированные",
                    info: "красиво и плавно на большинстве устройств",
                },
                simple: {
                    __index: "простые",
                    info: "упрощенный эффект выцветания",
                },
                stable: {
                    __index: "стабильные",
                    info: "используйте вместо оптимизированных, если они работают неправильно",
                },
                no_animation: {
                    __index: "без анимации",
                    info: "наипростейшая смена экранов приложения",
                },
            },
        },
        storage: {
            __index: "хранилище",
            used: "использовано",
            of: "из",
            calculating: "расчет",
            cleanup_planned: "при следующем запуске будет выполнена очистка",
            over_quota: "хранилище превысило лимит, но не поддерживает автоматическую очистку",
            dbs: {
                logs: {
                    __index: "отчеты",
                    description: "основная информация о работе приложения для отладки",
                },
                interaction_data: {
                    __index: "взаимодействие",
                    description: "различная информация о взаимодействии с приложением, такая как история текстового ввода",
                },
                time_management: {
                    __index: "планирование",
                    description: "ваши предметы, задания и расписание",
                },
            },
            actions: {
                clear: "очистить",
                export: "экспорт",
                import: "импорт",
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
    experiments: {
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
    select_option: "выберите из списка",
    tap_to_change: "нажмите, чтобы изменить",
    done: "готово",
    subject: "предмет",
    subjects: {
        __index: "предметы",
        list: "список предметов",
        name: "название",
    },
    location: "местоположение",
    select_file: "выберите файл",
    success: "успех",
    failure: "неудача",
    dev_warn: "эта функция находится в стадии разработки",
    preview_warn: "эта функция сейчас тестируется и может работать неправильно",
}
