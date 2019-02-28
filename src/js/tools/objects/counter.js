export default function getCounter() {
    let count = 0

    return function counter() {
        return ++count
    }
}
