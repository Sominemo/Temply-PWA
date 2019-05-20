import WarningConstructor from "./WarningConstructor"
import { Button } from "../input"

export default class WarningConstructorButton {
    constructor({ type = 0, button, ...params }) {
        let typeB = []
        if (type === 1) typeB = ["main"]
        else if (type === 2) typeB = ["accent"]
        else if (type === 3) typeB = ["alert"]

        return new WarningConstructor({
            ...params,
            type,
            sideContent: new Button(
                {
                    ...button,
                    type: [...typeB, ...(button.type || [])],
                    style: {
                        flexShrink: "0",
                        ...(button.style || {}),

                    },
                },
            ),
        })
    }
}
