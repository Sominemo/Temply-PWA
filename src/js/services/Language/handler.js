import LanguageCore from "./core"
import FieldsContainer from "../../tools/validation/fieldsContainer"
import FieldChecker from "../../tools/validation/fieldChecker"
import Report from "../../main/report"
import ucFirst from "../../tools/transformation/text/ucFirst"

const languagePack = LanguageCore.language

let { strings, library } = languagePack

function fallback(string) {
    try {
        string = string.toString()
        if ("fallbackString" in library
        && typeof library.fallbackString === "function") return library.fallbackString(string)
    } catch (e) {
        // Fallback to recovery
    }

    return `[${string}]`
}

function callLibrary(name, data, p, string) {
    if (!(name in library)
        || typeof library[name] !== "function") throw new Error("No such function in library")

    return library[name](data, p, string)
}

function $(string, p) {
    try {
        if (strings === undefined) {
            const loaded = LanguageCore.language
            // eslint-disable-next-line prefer-destructuring
            strings = loaded.strings
            // eslint-disable-next-line prefer-destructuring
            library = loaded.library
        }

        if (typeof string !== "string") throw new TypeError("Localization key is string only")

        let data = strings[string]

        if (string.match(/^@[a-zA-Z_/]+[^/]$/)) {
            const groups = string.substr(1).split("/")
            data = strings
            string = groups[groups.length - 1]
            while (groups.length && data !== undefined) {
                data = data[groups.shift()]
            }
        }

        if (typeof data === "string") return data

        if (data === undefined) throw new Error("Such string does not exist")

        if (typeof data !== "object") throw new Error("Incorrect string")
        if ("__index" in data && typeof data.__index === "string") return data.__index
        if (!("type" in data)) throw new Error("Incorrect string")

        if (data.type === "func") {
            new FieldsContainer([
                ["type", "name", "data"],
                {
                    type: new FieldChecker({ type: "string" }),
                    name: new FieldChecker({ type: "string" }),
                },
            ]).set(data)

            return callLibrary(data.name, data.data, p, string)
        }
        if (data.type === "funcs") {
            new FieldsContainer([
                ["type", "name", "data"],
                {
                    type: new FieldChecker({ type: "string" }),
                    name: new FieldsContainer("array", new FieldChecker({ type: "string" })),
                },
            ]).set(data)

            let res = data.data

            data.name.forEach((e) => {
                res = callLibrary(data.name, res, p, string)
            })

            return res
        }

        throw new Error("Unsupported Smart-String")
    } catch (e) {
        Report.write("Language string error", e)
        return fallback(string)
    }
}

function $$(...a) {
    return ucFirst($(...a))
}

export {
    $,
    $$,
}
