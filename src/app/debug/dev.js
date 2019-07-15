import * as idb from "idb"
import Language from "@Core/Services/Language/instance"
import TemplyApp from "@App/modules/main/TemplyApp"
import { Nav } from "@Environment/Library/DOM/buildBlock"
import Navigation from "@Core/Services/navigation"
import WindowManager from "@Core/Services/SimpleWindowManager"
import Design from "@Core/Services/design"
import Report from "@Core/Services/report"
import DBTool from "@Core/Tools/db/DBTool"
import DBUserPresence from "@Core/Services/DBUserPresence"
import SettingsStorage from "@Core/Services/Settings/SettingsStorage"
import SettingsCheckProvider from "@Core/Services/Settings/SettingsCheckProvider"
import SettingsLayout from "@Core/Services/Settings/user/layout"
import SettingsLayoutManager from "@Core/Services/Settings/user/manager"
import FieldChecker from "@Core/Tools/validation/fieldChecker"
import FieldsContainer from "@Core/Tools/validation/fieldsContainer"
import LanguageCore from "@Core/Services/Language/core"
import { $ } from "@Core/Services/Language/handler"
import Toast from "@Environment/Library/DOM/elements/toast"
import PointerInfo from "@Core/Services/PointerInfo"
import HistoryHints from "@Core/Services/HistoryHints"
import TimeManagementStorage from "@App/modules/diary/storage/TimeManagementStorage"
import { ContentEditable } from "@Environment/Library/DOM/object/input"
import DOM from "@DOMPath/DOM/Classes/dom"
import DOMController from "@DOMPath/DOM/Helpers/domController"
import { CoreLoader } from "@Core/Init/CoreLoader"

function compare(a, b, path = "/") {
    const keys = Object.keys(a)
    keys.forEach((e) => {
        if (b[e] === undefined) console.log(path + e)
        if (typeof b[e] === "object") compare(a[e], b[e], `${path + e}/`)
    })
}

async function compareLanguages(a, b) {
    a = new Language(a)
    b = new Language(b)
    await Promise.all([a.loadData(), b.loadData()])
    compare(a.strings, b.strings)
}

const DevUtils = {
    app: TemplyApp,
    dom: DOM,
    domc: DOMController,
    nav: Nav,
    navigation: Navigation,
    win: WindowManager,
    Design,
    idb,
    report: Report,
    dbtool: DBTool,
    dbuser: DBUserPresence,
    setStor: SettingsStorage,
    setCh: SettingsCheckProvider,
    setLay: SettingsLayout,
    setLayMan: SettingsLayoutManager,
    fch: FieldChecker,
    fct: FieldsContainer,
    langCore: LanguageCore,
    langInstance: Language,
    $,
    compare,
    compareLanguages,
    Toast,
    Pointer: PointerInfo,
    HistoryHints,
    TimeManagementStorage,
    lib: {
        ContentEditable,
    },
    CoreLoader,
}

CoreLoader.registerTask({
    id: "dev-accessories",
    presence: "Dev Accessories",
    task() {
        global.idb = idb
        global.dev = DevUtils
    },
})
