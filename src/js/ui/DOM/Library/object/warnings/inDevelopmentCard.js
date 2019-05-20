import { $$ } from "../../../../../services/Language/handler"
import WarningConstructor from "./WarningConstructor"

export default class InDevelopmentCard {
    constructor() {
        return new WarningConstructor({
            icon: "sms_failed",
            title: $$("@experiments/warning"),
            content: $$("dev_warn"),
            type: 3,
        })
    }
}
