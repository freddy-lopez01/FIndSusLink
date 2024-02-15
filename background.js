chrome.action.onClicked.addListener((tab) => {
    // If you want to check the current tab's URL when the icon is clicked
    if (tab.url && tab.url.startsWith("http:")) {
        // Correctly concatenate the tab.url to the redirectUrl query parameter
        const warningUrl = chrome.runtime.getURL("warning.html") + "?redirect=" + encodeURIComponent(tab.url);
        chrome.tabs.update(tab.id, { url: warningUrl });
    } else {
        // If the tab URL is not HTTP or tab.url is undefined, open the popup.html
        chrome.tabs.create({ url: chrome.runtime.getURL("popup.html") });
    }
});