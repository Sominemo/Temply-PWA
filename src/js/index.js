import "core-js/modules/es6.promise"
import "core-js/modules/es6.array.iterator"

import "../res/styles/fonts.css"
import "../res/styles/constructor.css"

import "./loaders/MainLoader"

import App from "./main/app"
import Report from "./main/report"

Report.write(`App ${App.fullName}: Build date ${App.buildDate}`)
