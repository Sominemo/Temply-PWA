export default class LanguageLibrary {
    static plural(data, { number = 1 } = {}) {
        if (number === 1) return data[0]
        if (1 in data) return data[1]
        return data[0] + (data[0].match(/(s|sh|ch|x|z)$/) ? "es" : "s")
    }

    static replace(data, { replace = {} } = {}) {
        Object.keys(replace).forEach((key) => {
            data = data.replace(RegExp(`/{%${key}}/`), replace[key].toString())
        })

        return data
    }
}
