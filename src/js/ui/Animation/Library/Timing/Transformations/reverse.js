export default function reversedTiming(t) {
    return tp => 1 - t(tp)
}
