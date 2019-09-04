export default class LanguageLibrary {
    static plural(data, { number = 1 } = {}) {
        if (number === 1) return data[0]
        if (1 in data) return data[1]
        return data[0] + (data[0].match(/(s|sh|ch|x|z)$/) ? "es" : "s")
    }

    static replace(data, { replace = {} } = {}) {
        Object.keys(replace).forEach((key) => {
            data = data.replace(RegExp(`{%${key}}`, "gi"), replace[key].toString())
        })

        return data
    }

    static romanize(num) {
        if (Number.isNaN(num)) { return NaN }
        const digits = String(+num).split("")
        const key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
            "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
            "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"]
        let roman = ""
        let i = 3
        while (i--) { roman = (key[+digits.pop() + (i * 10)] || "") + roman }
        return Array(+digits.join("") + 1).join("M") + roman
    }

    static weekDay(data, { day = 1, week = 1 } = {}) {
        return data[day] + (week > 1 ? ` ${this.romanize(week)}` : "")
    }
}
