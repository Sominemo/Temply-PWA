import idb from "idb"
import DOM from "../../ui/dom/dom"
import Nav from "../../ui/dom/domLibrary/buildBlock/nav"
import Navigation from "../../main/navigation"
import WindowManager from "../../ui/SimpleWindowManager"
import Report from "../../main/report"
import DBTool from "../db/DBTool"
import DBUserPresence from "../../services/DBUserPresence"
import SettingsStorage from "../../services/Settings/SettingsStorage"
import SettingsCheckProvider from "../../services/Settings/SettingsCheckProvider"

const DevUtils = {
    dom: DOM,
    nav: Nav,
    navigation: Navigation,
    win: WindowManager,
    idb,
    report: Report,
    dbtool: DBTool,
    dbuser: DBUserPresence,
    setStor: SettingsStorage,
    setCh: SettingsCheckProvider,
}

global.idb = idb


export default DevUtils
