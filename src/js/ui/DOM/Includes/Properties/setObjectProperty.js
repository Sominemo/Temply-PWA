import DOMController from "../../Helpers/domController"
import FieldsContainer from "../../../../tools/validation/fieldsContainer"
import FieldChecker from "../../../../tools/validation/fieldChecker"

export default (() => {
    const unique = "objectPropertySetter"

    const error = (data) => {
        if (!DOMController.errorIgnore(unique)) throw new Error("Can't set the object property")
        return data.element
    }

    function handlerFunc(data) {
        const self = this
        if (!Array.isArray(data.value)) throw new TypeError("Incorrect objectProperty type")

        data.value.forEach((e) => {
            const {
                name, handler, set, get,
            } = e

            new FieldsContainer([
                ["name"],
                {
                    name: new FieldChecker({
                        type: "string",
                        symbols: "a-zA-Z",
                        min: 3,
                        max: 20,
                    }),
                },
            ]).set({
                name,
            })

            if (name in self) throw new Error(`Method ${name} is already declared`)

            Object.defineProperty(self, name,
                {
                    ...(handler ? { value: handler, writable: false } : {}),
                    ...(get ? { get } : {}),
                    ...(set ? { set } : {}),
                })
        })

        return data.element
    }

    DOMController.registerProperty({
        name: "objectProperty",
        required: false,
        unique,
        handler: handlerFunc,
        error,
    })
})()
