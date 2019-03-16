export default function reversedEase(t) {
    return tp => 1 - t(1 - tp)
}
