// IDB support check
(() => {
    const db = window.indexedDB
        || window.mozIndexedDB
        || window.webkitIndexedDB
        || window.msIndexedDB

    if (!db) {
        throw new Error("No IndexedDB support in this browser")
    }
})()
