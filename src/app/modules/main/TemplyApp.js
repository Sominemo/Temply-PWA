import App from "@Core/Services/app"
import { Link, SVG } from "@Environment/Library/DOM/basic"
import {
    CardContent, Card, CardTextList, CardList,
} from "@Environment/Library/DOM/object/card"
import { Title, TwoSidesWrapper } from "@Environment/Library/DOM/object"
import { $$, $ } from "@Core/Services/Language/handler"
import Navigation from "@Core/Services/navigation"
import DOM from "@DOMPath/DOM/Classes/dom"
import { WindowContainer } from "@Environment/Library/DOM/buildBlock"
import WindowManager from "@Core/Services/SimpleWindowManager"
import getCounter from "@Core/Tools/objects/counter"
import AlignedContent from "@Environment/Library/DOM/object/AlignedContent"
import { SettingsActLink } from "@Environment/Library/DOM/settings"
import { CoreLoader } from "@Core/Init/CoreLoader"
import DynamicListPopup from "@Environment/Library/DOM/object/input/dynamicListPopup"
import LanguageCore from "@Core/Services/Language/core"

export default class TemplyApp extends App {
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
                    const link = new Link(mat[2], mat[1])
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


    static InitAboutScreen() {
        if (Navigation.parse.params[0] === "changelog") {
            this.InitChangelog()
            return
        }

        const w = new WindowContainer()
        WindowManager.newWindow().append(w)

        const counter = getCounter()
        function openFlags() {
            const r = counter()
            if (r < 4) return
            Navigation.url = { module: "flags" }
        }

        w.render(new Title($$("@about/app")))
        w.render(new Card(
            new AlignedContent([
                new DOM({
                    new: "div",
                    content: new SVG(require("@Resources/images/logo/vector.svg"), { height: "60px", margin: "20px", cursor: "pointer" }),
                    events: [
                        {
                            event: "click",
                            handler: openFlags,
                        },
                    ],
                    style: {
                        display: "flex",
                    },
                }),
                [
                    new Title(this.appName, 2, { margin: 0 }),
                    this.version,
                ],
            ]),
        ))
        w.render(new Card(new CardList(
            [
                { content: new TwoSidesWrapper($$("@about/build_date"), this.buildDate) },
                { content: new TwoSidesWrapper($$("@about/branch"), this.branch) },
                ...(this.debug ? [{ content: new TwoSidesWrapper($$("@about/debug"), this.debug.toString()) }] : []),
                ...("Windows" in window ? [{ content: new TwoSidesWrapper("WinRT", "true") }] : []),
            ],
            {}, true,
        )))
        w.render(new Card(new CardTextList([
            new SettingsActLink([
                () => { Navigation.url = { module: "about", params: ["changelog"] } },
                $$("@about/changelog"),
            ]),
            new SettingsActLink([
                () => { this.InitHelpList() },
                $$("@about/help/link"),
            ]),
        ])))
    }

    static InitChangelog() {
        const w = new WindowContainer()
        WindowManager.newWindow().append(w)

        w.render(new Title($$("@about/changelog")))
        w.render(this.changelogFormated())
    }

    static InitHelpList() {
        const curLang = $("@about/help/use_language", null, false) || LanguageCore.language.info.code

        DynamicListPopup({
            icon: "help",
            placeholder: $$("@about/help/search_placeholder"),
            async list(q) {
                try {
                    let articles = []
                    if (q === "") {
                        articles = await (
                            await fetch(`https://temply.procsec.top/help/list/${encodeURI(curLang)}`)
                        ).json()
                    } else {
                        articles = await (
                            await fetch(`https://temply.procsec.top/help/find/${encodeURI(curLang)}/${encodeURI(q)}`)
                        ).json()
                    }

                    return articles.map(article => (
                        {
                            name: article.title,
                            value: article.link,
                            icon: "arrow_forward",
                        }
                    ))
                } catch (e) {
                    return [
                        {
                            name: $$("@about/help/lookup_error"),
                            icon: "sentiment_dissatisfied",
                        },
                    ]
                }
            },
            onSelect(value) {
                window.open(value, "_blank")
            },
        })
    }
}

CoreLoader.registerTask({
    id: "about_app_module",
    presence: "About App Screen",
    task() {
        Navigation.addModule({
            name: "About",
            id: "about",
            callback() { TemplyApp.InitAboutScreen() },
        })
    },
})
