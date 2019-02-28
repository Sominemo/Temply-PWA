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

if (process.env.NODE_ENV === "development") {
    import(/* webpackChunkName: "devtools" */ "../dev")
        .then((dev) => {
            Report.write("DevTools loaded")
            global.dev = dev
        })
    import(/* webpackChunkName: "testlab" */ "../testlab")
}

SW.register()

domIncludesLoader().then(() => {
    import(/* webpackChunkName: "uiinit" */ "../ui/UIinit")
})

LoadState.is = true
