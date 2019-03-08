import "./ErrorHandler"
import "./FeatureChecker"
import "./Settings"
import "./Navigation"
import "./Listeners"
import "./DBControllers"
import Report from "../main/report"

import LoadState from "../services/LoadState"
import SW from "../main/SW"
import domIncludesLoader from "../ui/DOM/Helpers/domIncludesLoader"
import LanguageCore from "../services/Language/core"

if (process.env.NODE_ENV === "development") {
    import(/* webpackChunkName: "testlab" */ "../testlab")
}

SW.register()

Promise.all([
    domIncludesLoader(),
    LanguageCore.autoLoad(),
]).then(() => {
    import(/* webpackChunkName: "uiinit" */ "../ui/UIinit")
        .then(() => {
            LoadState.is = true
        })

        // Development tool
        .then(() => {
            if (process.env.NODE_ENV === "development") {
                import(/* webpackChunkName: "postlab" */"../postlab")
                import(/* webpackChunkName: "devtools" */ "../dev")
                    .then((dev) => {
                        Report.write("DevTools loaded")
                        global.dev = dev
                    })
            }
        })
})
