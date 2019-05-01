import * as idb from "idb"
import DOM from "./ui/DOM/Classes/dom"
import Nav from "./ui/DOM/Library/buildBlock/nav"
import Navigation from "./main/navigation"
import WindowManager from "./ui/SimpleWindowManager"
import Report from "./main/report"
import DBTool from "./tools/db/DBTool"
import DBUserPresence from "./services/DBUserPresence"
import SettingsStorage from "./services/Settings/SettingsStorage"
import SettingsCheckProvider from "./services/Settings/SettingsCheckProvider"
import SettingsLayout from "./services/Settings/user/layout"
import FieldChecker from "./tools/validation/fieldChecker"
import FieldsContainer from "./tools/validation/fieldsContainer"
import DOMController from "./ui/DOM/Helpers/domController"
import LanguageCore from "./services/Language/core"
import Language from "./services/Language/instance"
import { $ } from "./services/Language/handler"
import App from "./main/app"
import Toast from "./ui/DOM/Library/elements/toast"
import PointerInfo from "./services/PointerInfo"
import SettingsLayoutManager from "./services/Settings/user/manager"
import ContentEditable from "./ui/DOM/Library/object/input/contentEditable"
import HistoryHints from "./services/HistoryHints"

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
    app: App,
    dom: DOM,
    domc: DOMController,
    nav: Nav,
    navigation: Navigation,
    win: WindowManager,
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
    lib: {
        ContentEditable,
    },
}

global.idb = idb

export default DevUtils
