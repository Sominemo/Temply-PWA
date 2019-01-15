import DOMController from "./domController"

// Props
import elementConstructor from "./domModules/elementConstructor"
import genericElement from "./domModules/genericElement"
import appendContent from "./domModules/appendContent"
import attributeSetter from "./domModules/attributeSetter"
import valueSetter from "./domModules/valueSetter"
import setClasses from "./domModules/setClasses"
import propertySetter from "./domModules/propertySetter"
import eventsSetter from "./domModules/eventsSetter"
import htmlSet from "./domModules/htmlSet"
import idSetter from "./domModules/idSetter"

// Modules

// Config
DOMController.setConfig({
    reportRegistration: false,
    reparseAlways: false,
    useFunctionsComparation: false,

    useDefaultNodeTypeOnError: true,
    allowDeprecatedAttributeConstructor: true,

    contentStringAsTextNode: true,

    allowNodeAttributeDefinition: false,
})

global.wow = DOMController

// Register functions
htmlSet()
elementConstructor()
genericElement()
appendContent()
attributeSetter()
valueSetter()
setClasses()
idSetter()
eventsSetter()

// LAST
propertySetter()
