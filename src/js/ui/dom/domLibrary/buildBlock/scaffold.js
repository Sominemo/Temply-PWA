import DOM from "../../dom"
import Nav from "./nav"
import WindowManager from "../../../SimpleWindowManager"

export default class Scaffold {
    constructor(settings) {
        settings.navMenu.forEach((e) => {
            Nav.newItem(e)
        })

        return new DOM({
            new: "div",
            id: "scaffold",
            content: [
                new Nav(),
                new DOM({
                    new: "main",
                    content: WindowManager.Scaffold,
                }),
            ],
        })
    }
}
