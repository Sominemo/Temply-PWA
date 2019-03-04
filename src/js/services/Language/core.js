import langList from "Resources/language/list"
import Language from "./instance"
import FieldsContainer from "../../tools/validation/fieldsContainer"
import FieldChecker from "../../tools/validation/fieldChecker"
import Report from "../../main/report"

export default class LanguageCore {
    static _language = false

    static fallbackDefault = "en"

    static get languageList() {
        return langList
    }

    static get language() {
        return {
            strings: this._language.strings,
            library: this._language.library,
        }
    }

    static get defaultLang() {
        if (navigator.languages) {
            const lang = navigator.languages.find(e => this.isSupported(e.slice(0, 2)))
            return lang.slice(0, 2)
        }
        if (navigator.language) {
            if (this.isSupported(navigator.language.slice(0, 2))) {
                return navigator.language.slice(0, 2)
            }
        }
        if (this.isSupported(this.fallbackDefault)) return this.fallbackDefault

        throw new Error("No languages to apply")
    }

    static isSupported(code) {
        return this.languageList.find(e => e.code === code) !== undefined
    }

    static async autoLoad() {
        const l = this.defaultLang
        await this.applyLanguage(new Language(l))

        Report.write(`Language auto-loaded: ${l}`)

        return true
    }

    static async applyLanguage(lang) {
        if (!(lang instanceof Language)) throw new TypeError("Incorrect Language instance passed")

        try {
            if (await lang.loadData() !== true) throw new Error("Failed loading the pack")
            new FieldsContainer([
                ["strings", "library", "info"],
                {
                    strings: new FieldChecker({ type: "object" }),
                    info: new FieldChecker({ type: "object" }),
                    library: new FieldChecker({ type: "function" }),
                },
            ]).set(lang)
        } catch (e) {
            throw new Error("Invalid language package or an error during loading")
        }

        this._language = lang

        Report.write(`Language applied: ${lang.info.code}`)

        return true
    }
}
