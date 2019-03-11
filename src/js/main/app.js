/* global __PACKAGE_VERSION_NUMBER, __PACKAGE_BUILD_TIME,
__PACKAGE_APP_NAME, __PACKAGE_BRANCH, __PACKAGE_CHANGELOG */
import WindowManager from "../ui/SimpleWindowManager"
import WindowContainer from "../ui/DOM/Library/buildBlock/windowContainer"
import Card from "../ui/DOM/Library/object/card/card"
import Title from "../ui/DOM/Library/object/title"
import TwoSidesWrapper from "../ui/DOM/Library/object/twoSidesWrapper"
import CardList from "../ui/DOM/Library/object/card/cardList"
import Navigation from "./navigation"
import getCounter from "../tools/objects/counter"
import { $$ } from "../services/Language/handler"
import DOM from "../ui/DOM/Classes/dom"
import Link from "../ui/DOM/Library/basic/link"
import { CardContent, CardTextList } from "../ui/DOM/Library/object/card"

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

    static get changelog() {
        return __PACKAGE_CHANGELOG
    }

    static async lastChangelog() {
        const data = await fetch("https://temply.procsec.top/prop/changelog/")
        const json = await data.json()

        return json
    }

    static changelogFormated(cl) {
        cl = cl || this.changelog
        const output = []
        cl.forEach((group) => {
            const r = (e) => {
                const st = [e]
                let mat
                // eslint-disable-next-line no-cond-assign
                while (mat = /\[(.+?)\]\((.+?)\)/.exec(st[st.length - 1])) {
                    const cur = st.pop()
                    const all = cur.split(mat[0])
                    const link = new Link(mat[2].slice(1, -1), mat[1])
                    st.push(all[0], link, all[1])
                }

                const el = new CardContent(st)

                return el
            }
            if (group.list.added.length
                + group.list.changed.length
                + group.list.removed.length
                + group.list.other.length === 0) return
            output.push(new Title(group.name, 2))

            if (group.list.added.length) {
                output.push(new Card([
                    new Title($$("@about/changelog/added"), 3),
                    new CardTextList(group.list.added.map(r)),
                ]))
            }

            if (group.list.changed.length) {
                output.push(new Card([
                    new Title($$("@about/changelog/changed"), 3),
                    new CardTextList(group.list.changed.map(r)),
                ]))
            }

            if (group.list.removed.length) {
                output.push(new Card([
                    new Title($$("@about/changelog/removed"), 3),
                    new CardTextList(group.list.removed.map(r)),
                ]))
            }

            if (group.list.other.length) {
                output.push(new Card([
                    new Title($$("@about/changelog/other"), 3),
                    new CardTextList(group.list.other.map(r)),
                ]))
            }
        })

        return new DOM({
            new: "div",
            content: output,
        })
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
