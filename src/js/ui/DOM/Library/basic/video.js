import DOM from "../../Classes/dom"

export default class VideoBlock {
    constructor(src, {
        onclick = () => { }, onended = () => { }, style = {}, defaultTime = 0,
    } = {}) {
        return new Promise((resolve, reject) => {
            fetch(src)
                .then((response) => {
                    response.blob()
                        .then((blob) => {
                            const video = new DOM({
                                new: "video",
                                src: URL.createObjectURL(blob),
                                style,
                                events: [
                                    {
                                        event: "click",
                                        handler() { onclick(this) },
                                    },
                                    {
                                        event: "ended",
                                        handler() { onended(this) },
                                    },
                                ],
                                call: [
                                    ["load", [], (a, e) => { e.currentTime = defaultTime }],
                                ],
                            })
                            resolve(video)
                        })
                })
                .catch((e) => {
                    reject(e)
                })
        })
    }
}
