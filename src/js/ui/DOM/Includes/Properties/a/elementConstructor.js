import DOMController from "../../../Helpers/domController"

export default (() => {
    const unique = "elementConstructor"

    const handler = (data) => {
        if (data.element instanceof HTMLElement) {
            data.shared.elementConstructorSkipped = true
            return data.element
        }

        let createMethod = ""
        let type = null
        if (data.value === null || data.value === "e" || data.value === "element") {
            createMethod = "createElement"
            type = "element"
        } else if (data.value === "t" || data.value === "text") {
            createMethod = "createTextNode"
            type = "text"
        } else if (data.value === "c" || data.value === "comment") {
            createMethod = "createComment"
            type = "comment"
        } else if ((data.value === "a" || data.value === "attribute")
            && data.config.allowDeprecatedAttributeConstructor === true) {
            createMethod = "createAttribute"
            type = "attribute"
        } else throw new Error("Incorrect node type")

        const element = document[createMethod].bind(document)

        data.rewrite(type)

        return element
    }

    const error = (data) => {
        if (data.config.useDefaultNodeTypeOnError === true) {
            const replace = data
            data.value = null
            return handler(replace)
        }
        throw new Error("Can't continue creating the node without correct type")
    }

    DOMController.registerProperty({
        name: "type",
        required: true,
        unique,
        handler,
        error,
    })
})()
