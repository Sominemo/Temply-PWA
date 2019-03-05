/* global __PACKAGE_VERSION_NUMBER, __PACKAGE_BUILD_TIME, __PACKAGE_APP_NAME, __PACKAGE_BRANCH */
import WindowManager from "../ui/SimpleWindowManager"
import WindowContainer from "../ui/DOM/Library/buildBlock/windowContainer"
import Card from "../ui/DOM/Library/object/card/card"
import Title from "../ui/DOM/Library/object/title"
import TwoSidesWrapper from "../ui/DOM/Library/object/twoSidesWrapper"
import CardList from "../ui/DOM/Library/object/card/cardList"
import Navigation from "./navigation"
import getCounter from "../tools/objects/counter"
import { $$ } from "../services/Language/handler"

export default class App {
    static get version() {
        return __PACKAGE_VERSION_NUMBER
    }

    static get buildDate() {
        return __PACKAGE_BUILD_TIME
    }

    static get appName() {
        return __PACKAGE_APP_NAME
    }

    static get branch() {
        return __PACKAGE_BRANCH
    }

    static get fullName() {
        return `${this.appName} ${this.version} (${this.branch})`
    }

    static get debug() {
        return process.env.NODE_ENV === "development"
    }

    static InitAboutScreen() {
        const w = new WindowContainer()
        WindowManager.newWindow().append(w)

        const counter = getCounter()
        function openFlags() {
            const r = counter()
            if (r < 4) return
            Navigation.hash = { module: "flags" }
        }

        w.render(new Title($$("@about/app")))
        w.render(new Card(new CardList(
            [
                { content: this.appName },
                { content: new TwoSidesWrapper($$("@about/version"), this.version), handler: openFlags },
                { content: new TwoSidesWrapper($$("@about/build_date"), this.buildDate) },
                { content: new TwoSidesWrapper($$("@about/branch"), this.branch) },
                ...(this.debug ? [{ content: new TwoSidesWrapper($$("@about/debug"), this.debug.toString()) }] : []),
            ],
            {}, true,
        )))
    }
}
