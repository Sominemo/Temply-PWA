import CardList from "../object/card/cardList"
import Navigation from "../../../../main/navigation"
import ucFirst from "../../../../tools/transformation/text/ucFirst"
import TwoSidesWrapper from "../object/twoSidesWrapper"
import Icon from "../object/icon"

export default class SettingsActLink {
    constructor([act, sign, custom = false]) {
        if (typeof act === "string") act = [act]
        sign = sign || (typeof act === "string" ? ucFirst(act[0]) : "(...)")
        return new CardList([
            {
                content: new TwoSidesWrapper(sign, new Icon((custom || "chevron_right"), { marginLeft: "15px" })),
                handler: (typeof act === "function"
                    ? act
                    : () => { Navigation.hash = { module: "settings", params: act } }),
            },
        ], true)
    }
}
