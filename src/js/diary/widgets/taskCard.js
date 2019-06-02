import { Card, CardList, CardContent } from "../../ui/DOM/Library/object/card"
import DOM from "../../ui/DOM/Classes/dom"
import { TwoSidesWrapper, Icon } from "../../ui/DOM/Library/object"
import Navigation from "../../main/navigation"
import TimeManagementStorage from "../storage/TimeManagementStorage"
import Toast from "../../ui/DOM/Library/elements/toast"
import { $$ } from "../../services/Language/handler"
import SlideOut from "../../ui/Animation/Library/Effects/slideOut"
import Design from "../../main/design"

export default class TaskCard {
    constructor({
        color = Design.getVar("color-main"),
        title = "",
        content = "",
        subject = "Task",
        subjectKey = null,
        time = false,
        taskKey = null,
    }) {
        function IconButton(icon, handler) {
            return new DOM({
                new: "span",
                events: [
                    {
                        event: "click",
                        handler,
                    },
                ],
                style: {
                    margin: "0 5px",
                    color: Design.getVar("color-generic-light-a"),
                    cursor: "pointer",
                },
                content: new Icon(icon),
            })
        }

        const card = new Card(
            new CardList(
                [
                    {
                        content: new CardContent(
                            new TwoSidesWrapper(
                                new DOM({
                                    new: "div",
                                    style: {
                                        display: "flex",
                                        alignItems: "center",
                                    },
                                    content: [
                                        new DOM({
                                            new: "div",
                                            style: {
                                                background: color,
                                                opacity: "0.3",
                                                width: "10px",
                                                height: "10px",
                                                borderRadius: "50%",
                                            },
                                        }),
                                        new DOM({
                                            new: "div",
                                            content: subject,
                                            style: {
                                                marginLeft: "10px",
                                            },
                                        }),

                                    ],
                                }),
                                new DOM({
                                    new: "div",
                                    content: [
                                        IconButton("assignment", () => {
                                            Navigation.hash = {
                                                module: "tasks",
                                                params: ["list", subjectKey],
                                            }
                                        }),
                                        IconButton("done_all", async () => {
                                            await TimeManagementStorage.markTaskAs(taskKey)
                                            Toast.add($$("@tasks/marked_as_done"))
                                            await new SlideOut({ duration: 200 }).apply(card)
                                            card.destructSelf()
                                        }),
                                    ],
                                }),
                            ),
                        ),
                    },
                    {
                        content: new CardContent(
                            [
                                ...(time
                                    ? [new DOM({
                                        new: "time",
                                        style: {
                                            display: "inline-block",
                                            color: Design.getVar("color-generic-light-b"),
                                            fontSize: "8px",
                                            float: "right",
                                        },
                                        content: time,
                                    })] : []),
                                ...(title === "" ? []
                                    : [
                                        new DOM({
                                            new: "div",
                                            content: title,
                                            style: {
                                                fontFamily: Design.getVar("font-accent"),
                                                fontSize: "22px",
                                                marginTop: "15px",
                                            },

                                        }),
                                    ]),
                                ...(content === "" ? []
                                    : [
                                        new DOM({
                                            new: "div",
                                            content,
                                        }),
                                    ]),
                            ],
                        ),
                        style: {
                            position: "relative",
                        },
                    },
                ],
            ),
        )

        return card
    }
}
