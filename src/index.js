import "core-js/modules/es6.promise"
import "core-js/modules/es6.array.iterator"

import "./res/styles/fonts.css"
import "./res/styles/general.css"

import App from "./js/main/app"
import SW from "./js/main/SW"
import Report from "./js/main/report"

Report.write(`App ${App.fullName}: Build date ${App.buildDate}`)

if (process.env.NODE_ENV === "development") {
    import(/* webpackChunkName: "devtools" */ "./js/tools/internal/dev")
        .then((dev) => {
            Report.write("DevTools loaded")
            global.dev = dev
        })
}

SW.register()

import(/* webpackChunkName: "uiload" */ "./js/ui/dom/domModulesLoader").then(() => {
    import(/* webpackChunkName: "uiinit" */ "./js/ui/UIinit")
})
