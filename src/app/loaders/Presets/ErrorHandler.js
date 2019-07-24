import CriticalLoadErrorListener from "@Core/Services/CriticalLoadErrorListener"

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
    troubleshooting: "Check out our help article and troubleshoot the issue",
    maybe_its_us: "It can be Temply's fault",
    how_to_send_report: "Tell us about the problem if it is caused by Temply",
    send: "Report",
    technical: "Technical info",
    read: "Read it",
    link: "https://temply.procsec.top/help/article/en/troubleshoot-loading-error",
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

        document.body.innerHTML = `
    <style>#fatal-error-box h1, #fatal-error-box h3{
        padding: 10px 0 0 10px;
        margin: 0;
    }
    #fatal-error-box p, #fatal-error-box form, #fatal-error-box pre {
        padding: 0 10px 0;
        margin: 0;
    }
    #fatal-error-box form {
        margin-bottom: 15px;
    }
    #fatal-error-box h2 {
        padding: 0 0 0 10px;
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
    #fatal-error-box input[type="submit"].read {
        background: #3f51b5;
        color: white;
    }

    #fatal-error-box pre {
        overflow: scroll; 
        padding: 5px; 
        margin: 5px; 
        background: #eee; 
        border: #dddddd 1px solid; 
        user-select: all;
    }
    #fatal-error-box table {
        width: 100%;
    }
    #fatal-error-box td {
        vertical-align: top;
    }
    #fatal-error-box td.with-btn {
        vertical-align: middle;
        text-align: right;
    }
    #fatal-error-box {
     font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, Cantarell, 'Open Sans', Arial, sans-serif;   
    }</style>
    <div style="width: 100%; height: 100%; overflow: auto; position: fixed; top: 0; left: 0; display: flex;" id="fatal-error-box">
    <div style="max-width: 500px; padding: 10px; border: solid #efefef 2px; box-shadow: 0 0 20px rgba(0,0,0,.1); background: white; color: black; margin: auto; border-radius: 8px;">
    <h1>${loc.__index}</h1>
    <p> ${loc.description} </p>
    <br>
    <p>
    <form action="${loc.link}" method="POST">
    <input value="${htmlEntities(error)}" name="error" hidden>
    <input value="${htmlEntities(ua)}" name="browser" hidden>
    <table>
        <tr>
            <td>
                <h2> ${loc.lets_fix} </h2>
                <p>${loc.troubleshooting}</p>
            </td>
            <td class="with-btn"><input type="submit" value="${loc.read}" class="read"></td>
        </tr>
    </table>
    </form>
    </p>
    <p>
    <form action="https://temply.procsec.top/report/pwa/" method="POST">
    <input value="${htmlEntities(error)}" name="error" hidden>
    <input value="${htmlEntities(ua)}" name="browser" hidden>
    <table>
        <tr>
            <td>
                <h2> ${loc.maybe_its_us} </h2>
                <p>${loc.how_to_send_report}</p>
            </td>
            <td class="with-btn"><input type="submit" value="${loc.send}"></td>
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
