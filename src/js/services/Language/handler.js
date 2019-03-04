import LanguageCore from "./core"

const { strings, library } = LanguageCore.language

export default function $(string) {
    return strings[string]
}
