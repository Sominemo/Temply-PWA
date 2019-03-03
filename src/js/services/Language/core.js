import langList from "../../../res/language/list.json"

export default class LanguageCore {
    static packsLocation = "/language"

    static get languageList() {
        return langList
    }
}
