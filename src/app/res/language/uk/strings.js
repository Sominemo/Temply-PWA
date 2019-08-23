export default {
    tasks: {
        __index: "завдання",
        agenda: "порядок денний",
        inbox: "інше",
    },
    timetable: {
        __index: "розклад",
        defaults: "замовчування",
        hint: "підказка",
        where_to_control: "ви можете імпортувати та експортувати розклад у налаштуваннях сховища",
        check_out: "перейти",
        time_management_settings: "налаштування розкладу",
        subject_list_empty: "у вас немає збережених предметів",
        where_to_create_subjects: "ви можете створювати нові предмети під час редаґування розкладу",
        lesson_length: "довжина заняття",
        break_length: "довжина перерви",
        lesson_start: "початок заняття",
        lessons_start: "початок занять",
        lesson_end: "кінець заняття",
        empty: "розклад не заповнено",
        empty_description: "новостворені елементи зв'являтимуться тут",
        empty_fill_it: "заповнити",
        edit: {
            mode: "редагувати",
            add_item: "додати",
            edit_item: "змінити",
            del_item: "видалити",
            mode_exit: "залишити редактор",
            edit_entry: "редагування",
            new_entry: "додавання",
            deletion: "очищення",
            deletion_question: "ви впевнені, що бажаєте очистити список останніх використаних предметів?",
            delete_subject_warning: "це також видалить усі пов'язані предмети, окрім нотаток",
            cancel: "відміна",
            clear: "очистити",
            start_typing: "просто друкуйте...",
            details: "місце у розкладі",
            calculated: "– Обчислено",
            warning: "увага",
            dayjump: "заняття завершується наступного дня, тому будуть створені декілька записів, якщо не виникнуть конфлікти",
            dayjump_big: "вказаний проміжок часу не підтримується",
            new_subject_location: "схоже, ви тільки що створили новий предмет. Ми використаємо введене вами місце розташування як місце розташування за замовчуванням для даного предмета",
            creation_errors: {
                unknown: "невідома помилка",
                range: "некоректний проміжок часу",
                conflict: "конфлікт з уже існуючими записами",
                db: "помилка запису до бази даних",
            },
            creation_error: { type: "func", name: "replace", data: "{%error}. Запис №{%num} не було створено" },
            close: "закрити",
            error: "помилка",
            success: "збережено",
            removed: "видалено",
            remove_fail: "помилка при видаленні",
            subject_exists: "предмет з такою назвою вже існує",
        },
    },
    recovery_mode: {
        __index: "Аварійний режим",
        enter: "перезавантажте застосунок для входу у Аварійний режим",
        now: "Аварійний режим активний",
        back_to_normal: "Перезавантажте застосунок без спеціального хешу, щоб покинути його",
        idb_fail: {
            warning: "увага",
            description: "у Temply виникли труднощі при спробі використання сховища браузера. Використовуйте Google Chrome або Mozilla Firefox",
            dl_chrome: "завантажити Chrome",
            dl_ff: "завантажити Firefox",
        },
    },
    units: {
        min: {
            type: "func",
            name: "plural",
            data: ["хвилина", "хвилини", "хвилин"],
        },
    },
    dateformats: {
        week: {
            __index: "тиждень",
            days: {
                __index: "дні тижня",
                7: "неділя",
                1: "понеділок",
                2: "вівторок",
                3: "середа",
                4: "четвер",
                5: "п'ятниця",
                6: "субота",
            },
        },
        relative: {
            today: "сьогодні",
            yesterday: "вчора",
            tomorrow: "завтра",
        },
    },
    settings: {
        __index: "налаштування",
        locked_item: "Підказка: Ви не можете вносити тут зміни",
        skip_assets_loading: "минути завантаження ресурсів",
        restart_to_apply: "перезавантажте для застосування змін",
        language: "мова",
        errors: {
            no_page: "такої сторінки налаштувань нема",
            layout_failed: "схоже, у нас не вийшло завантажити Налаштування",
        },
        actions: {
            open_about: "про програму",
            go_main: "на головну",
            restart: "перезавантажити",
        },
        general: {
            __index: "загальні",
            information: "інформація",
            welcome_alpha: "ласкаво просимо у попереднє тестування Temply PWA",
        },
        appearance: {
            __index: "зовнішній вигляд",
            themes: {
                __index: "теми",
                system_theme_info: "за налаштуваннями системи",
                names: {
                    system: "системна",
                    default: "стандартна",
                    dark: "темна",
                },
            },
            window_transition: "переходи",
            animations: {
                optimized: {
                    __index: "оптимізовані",
                    info: "гарно та плавно на більшості пристроїв",
                },
                simple: {
                    __index: "прості",
                    info: "спрощений ефект вигоряння кольору",
                },
                stable: {
                    __index: "стабільні",
                    info: "використовуйте замість оптимізованих, якщо вони не працюють належним чином",
                },
                no_animation: {
                    __index: "без анімації",
                    info: "найпростіша зміна екранів програми",
                },
            },
        },
        storage: {
            __index: "сховище",
            used: "використано",
            of: "з",
            calculating: "розрахунок",
            cleanup_planned: "наступного запуску буде виконано очищення",
            over_quota: "сховище перевищило ліміт, але не підтримує автоматичне очищення",
            dbs: {
                logs: {
                    __index: "звіти",
                    description: "основна інформація про роботу програми для налагодження",
                },
                interaction_data: {
                    __index: "взаємодія",
                    description: "різна інформація про взаємодію з додатком, така як історія текстового введення",
                },
                time_management: {
                    __index: "планування",
                    description: "ваші предмети, завдання та розклад",
                },
            },
            actions: {
                clear: "очистити",
                export: "експорт",
                import: "імпорт",
            },
        },
        updates: {
            __index: "оновлення",
            title: "налаштування оновлень",
            description: `виберіть найзручнішу поведінку для повідомлень про оновлення.
            Натисніть на зображення, щоб побачити демонстрацію варіанту`,
            first_time_explanation: "Temply працює завдяки технології Progressive Web Apps.",
            learn_more_about_pwa: "Дізнайтесь більше про значення PWA для процесу оновлення",
            pwa_support_link: "https://temply.procsec.top/help/article/ru/what-is-pwa#pwa-role-in-update",
            change_notify_way: "показати налаштування оновлень",
            notify_later: "повідомляти лише після встановлення",
            ready: "оновлення вже тут",
            installed: "оновлення встановлено",
            tell_more: "більше",
            later: "пізніше",
            got_it: "зрозуміло",
            restart_now: "застосувати зараз",
            pending: "оновлення вже готове",
            click_to_restart: "натисніть на кнопку для встановлення",
            restart: "перезавантажити",
            types: {
                silently: {
                    __index: "тихо",
                    info: `temply буде оновлюватися тихо і непомітно, Ви зможете дізнаватися про зміни самостійно.
                    Оновлення застосовуються після перезавантаження застосунку`,
                },
                toast: {
                    __index: "підказка",
                    info: `коли надійде оновлення, Ви побачите невелику підказку.Натиснувши на неї Ви
                    отримаєте інформацію про оновлення і зможете вжити відповідних заходів`,
                },
                popup: {
                    __index: "вікно",
                    info: `повідомлення про оновлення та список змін з'являться на вашому екрані автоматично,
                    тому вам не доведеться нікуди натискати`,
                },
            },
        },
    },
    about: {
        __index: "про",
        app: "про програму",
        version: "версія",
        build_date: "дата збирання",
        branch: "гілка",
        debug: "зневаджування",
        changelog: {
            __index: "список змін",
            added: "додано",
            changed: "змінено",
            removed: "прибрано",
            other: "інше",
        },
        help: {
            __index: "допомога",
            use_language: "ru",
            link: "Зупинись. Тобі потрібна допомога",
            search_placeholder: "шукати статті...",
            lookup_error: "не вдалось завантажити список",
        },
    },
    experiments: {
        __index: "експерименти",
        miscellaneous: "різне",
        warning: "попередження",
        harmful_actions: `ці опції експериментальні і деякі з них можуть викликати проблеми, порушувати стабільність програми або зовсім перешкоджати її роботі.
        Після застосування змін варто перезавантажити застосунок.`,
        reload_page: "перезавантажити",
        reset_flags: "скинути",
        list: "список",
        no_exps_placeholder: "зараз тестувати нічого",
    },
    unexpected_error: "ой!",
    select_option: "оберіть зі списку",
    tap_to_change: "натисніть, щоб змінити",
    done: "готово",
    subject: "предмет",
    subjects: {
        __index: "предмети",
        list: "список предметів",
        name: "назва",
    },
    location: "розташування",
    select_file: "оберіть файл",
    success: "успіх",
    failure: "невдача",
    dev_warn: "ця функція знаходиться у стані ррозробки",
    preview_warn: "ця функція зараз тестується та може працювати неправильно",
    loading_error: {
        __index: "Помилка завантаження",
        alert: "От халепа, щось пішло не так",
        description: "На жаль, Temply не вдалось завантажитись",
        lets_fix: "Давайте виправимо це",
        troubleshooting: "Прочитайте нашу довідку, щоб усунути цю несправніть",
        maybe_its_us: "Можливо, справа у Temply",
        how_to_send_report: "Повідомте нам про несправність, якщо вона виникла через Temply",
        send: "Надіслати",
        technical: "Техническая информация",
        read: "Прочитати",
        link: "https://temply.procsec.top/help/article/ru/troubleshoot-loading-error",
    },
}
