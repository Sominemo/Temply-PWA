function getPositionAtCenter(element) {
    if ("x" in element && "y" in element) return { x: element.x, y: element.y }

    const {
        top, left, width, height,
    } = element.sizes
    return {
        x: left + width / 2,
        y: top + height / 2,
    }
}

export default function getDistanceBetweenElements(a, b) {
    const aPosition = getPositionAtCenter(a)
    const bPosition = getPositionAtCenter(b)

    return Math.hypot(aPosition.x - bPosition.x, aPosition.y - bPosition.y)
}
