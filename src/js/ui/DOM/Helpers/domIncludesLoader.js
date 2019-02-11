import DOMController from "./domController"

const cache = {}

function importAll(r) {
    r.keys().forEach((key) => { cache[key] = r(key) })
}

importAll(require.context("../Includes/Modificators/", true, /\.js$/))
importAll(require.context("../Includes/Modules/", true, /\.js$/))
importAll(require.context("../Includes/Properties/", true, /\.js$/))

// Config
DOMController.setConfig({
    reportRegistration: false,
    reparseAlways: false,
    useFunctionsComparation: false,

    useDefaultNodeTypeOnError: true,
    allowDeprecatedAttributeConstructor: true,

    contentStringAsTextNode: true,

    allowNodeAttributeDefinition: false,

    eventsOnClickAutoTabIndex: true,
})
