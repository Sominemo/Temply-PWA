export default class LanguageLibrary {
    // [число, числа, чисел] [минута, минуты, минут]
    static plural(data, { number = 1 } = {}) {
        number = Math.abs(number)
        if (Math.floor(number) !== number) return data[1]
        return data[
            // eslint-disable-next-line no-nested-ternary
            (number % 10 === 1 && number % 100 !== 11) ? 0
                : number % 10 >= 2
                    && number % 10 <= 4
                    && (number % 100 < 10 || number % 100 >= 20) ? 1 : 2
        ]
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
