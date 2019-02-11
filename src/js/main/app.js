/* global __PACKAGE_VERSION_NUMBER, __PACKAGE_BUILD_TIME, __PACKAGE_APP_NAME, __PACKAGE_BRANCH */
import WindowManager from "../ui/SimpleWindowManager"
import WindowContainer from "../ui/DOM/Library/buildBlock/windowContainer"
import Card from "../ui/DOM/Library/object/card/card"
import CardTextList from "../ui/DOM/Library/object/card/cardTextList"
import Title from "../ui/DOM/Library/object/title"
import TwoSidesWrapper from "../ui/DOM/Library/object/twoSidesWrapper"

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

        w.render(new Title("About App"))
        w.render(new Card(new CardTextList(
            [
                this.appName,
                new TwoSidesWrapper("Version", this.version),
                new TwoSidesWrapper("Build date", this.buildDate),
                new TwoSidesWrapper("Branch", this.branch),
                new TwoSidesWrapper("Debug", this.debug.toString()),
            ],
            {}, true,
        )))
    }
}
