export default class FieldCheckerError extends Error {
    constructor(error, param) {
        super(`Error ${error}. Data: ${JSON.stringify(param)}`)
    }
}
