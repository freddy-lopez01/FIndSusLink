chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        const url = new URL(details.url);
        if (url.protocol === "http:") {
            // Redirect to warning page
            return {redirectUrl: chrome.runtime.getURL("warning.html?redirect=" + encodeURIComponent(details.url))};
        }
    },
    {urls: ["<all_urls>"]},
    ["blocking"]
);