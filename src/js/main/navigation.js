import FieldsContainer from "../tools/validation/fieldsContainer"
import FieldChecker from "../tools/validation/fieldChecker"
import Nav from "../ui/DOM/Library/buildBlock/nav"
import WindowManager from "../ui/SimpleWindowManager"
import Report from "./report"

export default class Navigation {
    static prefix = "/"

    static paramsDelimeter = "/?/"

    static fallbackSplitter = "/"

    static modulesRegister = []

    static get hash() {
        const hash = window.location.hash.slice(1)

        if (typeof this.prefix === "string"
            && this.prefix !== "") {
            if (hash.indexOf(this.prefix) !== 0) return ({ error: 2, info: "Incorrect prefix" })
        }
        return hash.slice(this.prefix.length)
    }

    static set hash(hash) {
        if (typeof hash === "object") {
            new FieldsContainer([
                ["module"],
                {
                    module: new FieldChecker({ type: "string" }),
                    params: new FieldChecker({ type: "object" }),
                },
            ]).set(hash)
            hash.params = hash.params || {}
            const stringHash = `${this.prefix}${hash.module}${(Object.keys(hash.params).length > 0 ? `${this.paramsDelimeter}${this.paramsGenerator(hash.params)}` : "")}`
            this.hash = stringHash
            return stringHash
        }
        window.location.hash = hash.toString()
        return this.parse(hash)
    }

    static history = []

    static historyCurrent = [Object.create(null)]

    static historyFuture = []

    static historyCurrentFuture = []

    static historyLength = window.history.length

    static get Current() {
        return this.historyCurrent[this.historyCurrent.length - 1]
    }

    static set Current(set) {
        if (typeof set !== "object") throw new Error("Incorrect Current set")

        this.historyCurrent[this.historyCurrent.length - 1] = set
    }

    static paramsParser(params = "") {
        params = params.toString()
        if (params === "") return []
        try {
            return JSON.parse(`{"${params.replace(/&/g, "\",\"").replace(/=/g, "\":\"")}"}`,
                (key, value) => (key === "" ? value : decodeURIComponent(value)))
        } catch (e) {
            return params.split(this.fallbackSplitter).map(el => decodeURIComponent(el))
        }
    }

    static paramsGenerator(params = {}) {
        if (typeof params !== "object") return ""

        if (Array.isArray(params)) {
            return params.map(e => encodeURIComponent(e)).join(this.fallbackSplitter)
        }
        return Object.entries(params).map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val.toString())}`).join("&")
    }

    static addModule(config) {
        new FieldsContainer([
            ["name", "id", "callback"],
            {
                name: new FieldChecker({ type: "string" }),
                id: new FieldChecker({ type: "string", symbols: "a-z_" }),
                callback: new FieldChecker({ type: "function" }),
            },
        ]).set(config)

        this.modulesRegister.push(config)
    }

    static parse(hash = this.hash) {
        let module = ""
        let paramsString = ""
        let params = []

        hash = hash.toString()
        // Is Empty
        if (hash === "") return ({ error: 1, info: "Hash is empty" })

        // Params splitter
        const paramsDelimeter = hash.indexOf(this.paramsDelimeter)
        if (paramsDelimeter !== -1) {
            module = decodeURIComponent(hash.slice(0, paramsDelimeter))
            paramsString = hash.slice(paramsDelimeter + this.paramsDelimeter.length)
            params = this.paramsParser(paramsString)
        } else {
            module = decodeURIComponent(hash)
        }

        hash = decodeURIComponent(hash)

        const r = {
            module,
            params,
            hash,
        }

        return (r)
    }

    parsedCallback(nav) {
        // Callback and Nav
        const listeners = this.modulesRegister.filter(e => e.name === module)
        listeners.forEach((e) => {
            e.callback(nav)
            if (e.id !== "") Nav.highlight(e, nav)
        })
    }

    static get whatHappened() {
        // SOURCE: https://gist.github.com/sstephenson/739659
        // TODO: Better strategy

        if (this.history.length === 0) this.history.push(this.hash)

        // const history = window.history.length
        // const { hash } = this

        // if (this.historyLength !== history) {
        return "change"
        // }

        // if (this.history[this.history.length - 2] === hash) {
        //    return "forward"
        // }

        // return "back"
    }

    static listener(manual) {
        const event = manual || this.whatHappened

        const parsed = this.parse()

        const { hash } = this

        if ((typeof parsed === "object" && "error" in parsed)
            || (typeof hash === "object" && "error" in hash)) throw Error(parsed.info)

        if (event === "change") {
            this.history.push(hash)
            this.historyCurrent.push(Object.create(null))
            this.historyLength = window.history.length
            Report.write("* Navigate:", parsed)
            return this.go(parsed.module, parsed.params, manual)
        }

        if (event === "back") {
            this.historyFuture.push(this.history.pop())
            this.historyCurrentFuture.push(this.historyCurrent.pop())
            Report.write("* Navigate Back:", parsed)
            return WindowManager.navBack(parsed.module, parsed.params)
        }

        if (event === "forward") {
            this.history.push(this.historyFuture.pop())
            this.historyCurrent.push(this.historyCurrentFuture.pop())
            Report.write("* Navigate Forward:", parsed)
            return WindowManager.navForward(parsed.module, parsed.params)
        }

        return false
    }

    static go(module, params, manual) {
        const callbacks = this.modulesRegister.filter(e => e.id === module)

        if (!(callbacks.length > 0)) {
            if (manual !== undefined) this.InitNavigationError()
            return false
        }

        Nav.highlight({ id: module })
        callbacks.forEach((e) => {
            if ("callback" in e && typeof e.callback === "function") e.callback(module, params)
        })
        return true
    }

    static InitNavigationError() {
        this.hash = {
            module: "timetable",
            params: {},
        }
    }

    static defaultScreen() {
        this.hash = {
            module: "timetable",
            params: {},
        }
    }
}
