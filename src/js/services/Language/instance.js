import LanguageCore from "./core"
import FieldChecker from "../../tools/validation/fieldChecker"
import FieldsContainer from "../../tools/validation/fieldsContainer"

export default class Language {
    library = false

    strings = false

    info = false

    constructor(code) {
        let l
        try {
            l = LanguageCore.languageList.find(e => e.code === code)
            new FieldsContainer([
                ["code", "name", "dir", "author"],
                {
                    code: new FieldChecker({ type: "string", symbols: "a-z-" }),
                    name: new FieldChecker({ type: "string" }),
                    dir: new FieldChecker({ type: "string", symbols: "a-z-" }),
                    author: new FieldChecker({ type: "string", symbols: "a-zA-Zа-яА-Я._#@*-" }),
                },
            ]).set(l)
        } catch (e) {
            throw new Error("The language you specified does not supported or invalid")
        }

        this.info = l
    }

    async loadData() {
        const res = import(`Resources/language/${this.info.dir}/index`)
        return res
    }
}
