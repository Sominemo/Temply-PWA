import FieldsContainer from "../../../../../tools/validation/fieldsContainer"
import FieldChecker from "../../../../../tools/validation/fieldChecker"
import Radio from "./radio"
import DOM from "../../../Classes/dom"

export default class MDRadio {
    constructor(data = [], classes = []) {
        new FieldsContainer(["array",
            new FieldsContainer([
                [],
                {
                    handler: new FieldChecker({ type: "function" }),
                    selected: new FieldChecker({ type: "boolean" }),
                    include: new FieldChecker({ type: "boolean" }),
                },
            ]),
        ]).set(data)

        return new Radio(data.map(e => ({
            element: new DOM({
                new: "md-radio",
                class: classes,
            }),
            selected: !!e.selected,
            handler: e.handler,
            include: e.include,
        })))
    }
}
