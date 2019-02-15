import LoadState from "../services/LoadState"

function loadError(e) {
    // eslint-disable-next-line no-alert
    alert("Aw geez, looks like Temply PWA can't run in this browser")

    console.log(e)

    const error = (e.message ? `${e.message} on ${e.filename}:${e.lineno}:${e.colno}` : "No debug info available")
    const ua = window.navigator.userAgent

    document.body.innerHTML = `
    <style>h1,p{margin: 10px;}</style>
    <div style="max-width: 500px; padding: 10px; border: solid black 2px; background: white; color: black; margin: auto; margin-top: 15px;">
    <h1>Temply PWA has encouraged a critical error</h1>
    <p>This app can't be launched in current browser.</p>
    <h2> What does this mean? </h2>
    <p> This error indicates that Temply PWA cannot be executed on your browser. This is largely due to the fact that older versions of browsers do not support the latest technologies that are used in Temply PWA to achieve maximum stability and smoothness of work. </p>
    
    <h2> How to fix it? </h2>
    <p> Install the latest browser on your platform that supports the latest Web technologies, such as PWA. </p>
    <p> <b> Recommended </b>: Chrome 70+ </p>
    <p> <b> Warning! </b> On Windows XP, it can be difficult to even use the latest available browser version, since most developers no longer support this platform. </p>
    <h2>Details about the error:</h2>
    <pre style="overflow: scroll;">${error}</pre>
    <p>
    <a href="https://temply.procsec.top/report/pwa/?error=${encodeURIComponent(error)}&browser=${encodeURIComponent(ua)}">If you sure you are using a modern browser you can send a report automatically by clicking this link</a>
    </p>
    </div>`
}

window.addEventListener("error", (e) => {
    if (LoadState.is === true) return

    if (!document.body) window.addEventListener("load", () => loadError(e))
    else loadError(e)
})
