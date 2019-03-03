import langList from "Resources/language/list"

export default class LanguageCore {
    static packsLocation = "/language"

    static get languageList() {
        return langList
    }
}
