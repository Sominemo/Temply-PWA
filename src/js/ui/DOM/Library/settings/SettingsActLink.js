import CardList from "../object/card/cardList"
import Navigation from "../../../../main/navigation"

export default class SettingsActLink {
    constructor({ sign, act = [] }) {
        sign = sign || act[0].toString().charAt(0).toUpperCase()
        return new CardList({ content: sign, handler() { Navigation.hash = { module: "settings", params: act } } })
    }
}
