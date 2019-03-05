export default function errorToObject(e) {
    function replaceErrors(jk, value) {
        if (value instanceof Error) {
            const error = {}

            Object.getOwnPropertyNames(value).forEach((key) => {
                error[key] = value[key]
            })

            return error
        }

        return value
    }

    return JSON.parse(JSON.stringify(e, replaceErrors))
}
