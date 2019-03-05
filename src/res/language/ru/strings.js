export default {
    hello: { type: "func", name: "replace", data: "привет, {%username}" },
    apple: { type: "func", name: "plural", data: ["яблоко", "яблока", "яблок"] },
    settings: {
        __index: "настройки",
        welcome: {
            hello: "вы в настройках",
        },
    },
}
