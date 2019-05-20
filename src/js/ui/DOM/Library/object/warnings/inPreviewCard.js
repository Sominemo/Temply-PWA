import { $$ } from "../../../../../services/Language/handler"
import WarningConstructor from "./WarningConstructor"

export default class InDevelopmentCard {
    constructor() {
        return new WarningConstructor({
            icon: "whatshot",
            title: $$("@experiments/warning"),
            content: $$("preview_warn"),
            type: 2,
        })
    }
}
