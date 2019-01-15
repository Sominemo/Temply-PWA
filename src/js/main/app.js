export default class App {
    static get version() {
        return "[AIV]{version}[/AIV]"
    }

    static get buildDate() {
        return "[AIV]{date}[/AIV]"
    }

    static get appName() {
        return "Temply PWA"
    }

    static get branch() {
        return "early-dev"
    }

    static get fullName() {
        return `${this.appName} ${this.version} (${this.branch})`
    }

    static get debug() {
        return this.branch.includes("dev")
            || this.branch.includes("beta")
    }
}
