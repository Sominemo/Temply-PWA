export default class PointerInfo {
    static lastMoveEvent = {
        clientX: 0,
        clientY: 0,
        pageX: 0,
        pageY: 0,
        layerX: 0,
        layerY: 0,
        path: [],
        fromElement: null,
        toElement: null,
    }

    static lastClickEvent = {
        clientX: 0,
        clientY: 0,
        pageX: 0,
        pageY: 0,
        layerX: 0,
        layerY: 0,
        path: [],
    }

    static lastContextEvent = {
        clientX: 0,
        clientY: 0,
        pageX: 0,
        pageY: 0,
        layerX: 0,
        layerY: 0,
        path: [],
    }

    static moveEventListener(e) {
        this.lastMoveEvent = e
    }

    static clickEventListener(e) {
        this.lastClickEvent = e
    }

    static contextEventListener(e) {
        this.lastContextEvent = e
    }
}
