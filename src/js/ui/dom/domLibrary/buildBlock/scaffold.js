import DOM from "../../dom"
import Nav from "./nav"
import WindowManager from "../../../SimpleWindowManager"

export default class Scaffold {
    constructor(settings) {
        return new DOM({
            new: "div",
            id: "scaffold",
            content: [
                new Nav([
                    {
                        name: "Schedule",
                        icon: "access_time",
                        handler: () => {},
                    },
                ]),
                new DOM({
                    new: "main",
                    content: WindowManager.Scaffold,
                }),
            ],
        })
    }
}
