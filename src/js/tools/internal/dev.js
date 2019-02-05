import idb from "idb"
import DOM from "../../ui/dom/dom"
import Nav from "../../ui/dom/domLibrary/buildBlock/nav"
import Navigation from "../../main/navigation"
import WindowManager from "../../ui/SimpleWindowManager"
import Report from "../../main/report"

const DevUtils = {
    dom: DOM,
    nav: Nav,
    navigation: Navigation,
    win: WindowManager,
    idb,
    report: Report,
}

global.idb = idb


export default DevUtils
