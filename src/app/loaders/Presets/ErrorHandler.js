import CriticalLoadErrorListener from "@Core/Services/CriticalLoadErrorListener"
import uaTools from "express-useragent"

function htmlEntities(str) {
    const div = document.createElement("div")
    div.innerText = str
    return div.innerHTML
}

const fallback = {
    __index: "Loading error",
    alert: "Aw geez, something went wrong",
    description: "Sorry, but Temply just failed to load",
    lets_fix: "We are here to help you",
    whats_your_browser: "What browser do you use?",
    supported_browsers: "Temply PWA is officially supported on the newest versions of browsers, such as Google Chrome 73+, Firefox 65+, and also Safari on iOS 12+.",
    your_browser_is: "It seems your browser is",
    is_network_stable: "Is your Internet connection stable enough?",
    network_troubleshooting: "If your Internet connection works with interrupts, Temply may fail to load language packs and other modules correctly. Try to reload the page. If it doesn't help, clear your browser cache.",
    maybe_its_us: "It can be Temply's fault",
    how_to_send_report: "If you think the problem was caused by Temply, just tell us about it by pressing the \"Send\" button",
    send: "Send",
    technical: "Technical info",
}

function getLoc() {
    let res = {}

    try {
        const { $ } = require("@Core/Services/Language/handler")
        Object.keys(fallback).forEach((k) => {
            try {
                res[k] = htmlEntities($(`@loading_error/${k}`, null, false))
            } catch (e) {
                res[k] = htmlEntities(fallback[k])
            }
        })
    } catch (e) {
        console.error(e)
        res = fallback
    }

    return res
}

function loadError(e, consoleIt) {
    try {
        let loc = fallback
        try {
            loc = getLoc()
        } catch (er) {
            console.error(er)
        }

        // eslint-disable-next-line no-alert
        alert(loc.alert)

        if (consoleIt) console.error(e)

        let error
        if (typeof e === "object" && e !== null) {
            const filename = e.filename || e.fileName || "[unknown file]"
            const lineno = e.lineno || e.lineNumber || "?"
            const colno = e.colno || e.columnNumber || "??"

            error = (e.message ? `${e.message} on ${filename}:${lineno}:${colno}` : "No debug info available")
        } else error = String(e)

        const ua = window.navigator.userAgent
        const uaParsed = uaTools.parse(ua)

        document.body.innerHTML = `
    <style>#fatal-error-box h1, #fatal-error-box h3{
        padding: 10px 0 0 10px;
        margin: 0;
    }
    #fatal-error-box p, #fatal-error-box form, #fatal-error-box pre {
        padding: 0 10px 0;
        margin: 0;
    }
    #fatal-error-box h2 {
        padding: 15px 0 0 10px;
        margin: 0;
    }
    #fatal-error-box h1, #fatal-error-box h2, #fatal-error-box h3 {
        font-weight: 500;
        margin: 0;
    }
    #fatal-error-box input[type="submit"] {
        padding: 10px 15px;
        border-radius: 8px;
        border: 0;
        margin: 5px;
        background: #dddddd;
    }
    #fatal-error-box pre {
        overflow: scroll; 
        padding: 5px; 
        margin: 5px; 
        background: #eee; 
        border: #dddddd 1px solid; 
        user-select: all;
    }
    #fatal-error-box {
     font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, Cantarell, 'Open Sans', Arial, sans-serif;   
    }</style>
    <div style="width: 100%; height: 100%; overflow: auto; position: fixed; top: 0; left: 0;" id="fatal-error-box">
    <div style="max-width: 500px; padding: 10px; border: solid black 2px; background: white; color: black; margin: auto; margin-top: 15px; border-radius: 8px;">
    <h1>${loc.__index}</h1>
    <p> ${loc.description} </p>

    <h2> ${loc.lets_fix} </h2>

    <h3> ${loc.whats_your_browser} </h3>
    <p> ${loc.supported_browsers} </p>
    <p> ${loc.your_browser_is} <b>${uaParsed.browser} ${uaParsed.version}</b></p>
    
    <h3> ${loc.is_network_stable} </h3>
    <p> ${loc.network_troubleshooting} </p>

    <h3> ${loc.maybe_its_us} </h3>
    <p>
    <form action="https://temply.procsec.top/report/pwa/" method="POST">
    <input value="${htmlEntities(error)}" name="error" hidden>
    <input value="${htmlEntities(ua)}" name="browser" hidden>
    <table>
        <tr>
            <td>${loc.how_to_send_report}</td>
            <td style="vertical-align: center"><input type="submit" value="${loc.send}"></td>
        </tr>
    </table>
    </form>
    </p>
    <h3> ${loc.technical} </h3>
    <pre>${error}</pre>
    </div>
    </div>`
    } catch (er) {
        console.error(er)
    }
}

CriticalLoadErrorListener.listener = loadError
