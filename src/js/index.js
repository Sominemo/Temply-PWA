import "core-js/modules/es6.promise"
import "core-js/modules/es6.array.iterator"

import "../res/styles/fonts.css"
import "../res/styles/constructor.css"

import "./loaders/MainLoader"

import App from "./main/app"
import SW from "./main/SW"
import Report from "./main/report"

Report.write(`App ${App.fullName}: Build date ${App.buildDate}`)

if (process.env.NODE_ENV === "development") {
    import(/* webpackChunkName: "devtools" */ "./tools/internal/dev")
        .then((dev) => {
            Report.write("DevTools loaded")
            global.dev = dev
        })
        import(/* webpackChunkName: "testlab" */ "./testlab")
}

SW.register()

import(/* webpackChunkName: "uiload" */ "./ui/DOM/Helpers/domIncludesLoader").then(() => {
    import(/* webpackChunkName: "uiinit" */ "./ui/UIinit")
})
