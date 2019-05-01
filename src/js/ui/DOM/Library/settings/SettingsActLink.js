import CardList from "../object/card/cardList"
import Navigation from "../../../../main/navigation"
import ucFirst from "../../../../tools/transformation/text/ucFirst"
import TwoSidesWrapper from "../object/twoSidesWrapper"
import Icon from "../object/icon"
import DOM from "../../Classes/dom"

export default class SettingsActLink {
    constructor([act, sign, custom = false]) {
        if (typeof act === "string") act = [act]
        sign = sign || (typeof act === "string" ? ucFirst(act[0]) : "(...)")
        const signElement = new DOM({ new: "div", content: sign })
        return new CardList([
            {
                content: new TwoSidesWrapper(signElement, new Icon((custom || "chevron_right"), { marginLeft: "15px" })),
                handler: (typeof act === "function"
                    ? act
                    : () => { Navigation.hash = { module: "settings", params: act } }),
                object: [
                    {
                        name: "changeSign",
                        handler(n) { signElement.clear(n) },
                    },
                ],
            },
        ], true)
    }
}
