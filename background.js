let badUrls = [];
let tabAllowance = {};

async function loadBadUrls() {
    try {
        const response = await fetch(chrome.runtime.getURL('badurls.json'));
        const data = await response.json();
        badUrls = data.badUrls;
        console.log('Bad URLs loaded', badUrls);
    } catch (error) {
        console.error('Failed to load badurls.json', error);
    }
}

function isMalicious(url) {
    return badUrls.some(pattern => {
        // Convert wildcard URL patterns to regex
        const regexPattern = pattern
            .replace(/[.+^${}()|[\]\\]/g, '\\$&') // Escape regex characters
            .replace(/\*/g, '.*'); // Convert * wildcards to .*
        const regex = new RegExp(regexPattern);
        return regex.test(url);
    });
}

function scanTabs() {
    chrome.tabs.query({}, function(tabs) {
        let maliciousTabsInfo = tabs
            .filter(tab => tab.url && isMalicious(tab.url))
            .map(tab => ({ url: tab.url, title: tab.title }));
        
        // Send the information to the popup
        if (popupPort) {
            popupPort.postMessage({ maliciousTabsInfo });
        }
    });
}

let popupPort = null;

chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name === "popup");
    popupPort = port;

    port.onDisconnect.addListener(function() {
        popupPort = null;
    });

    port.onMessage.addListener(function(message) {
        if (message.action === 'scanTabs') {
            scanTabs();
        }
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'allowUrl' && sender.tab) {
        // Store that the current tab's URL is allowed
        tabAllowance[sender.tab.id] = message.url;
        sendResponse({status: 'URL allowed for tab'});
    }
});

loadBadUrls();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'loading') {
        // Prevent redirection if the tab is already showing the warning page
        if (new URL(changeInfo.url).pathname.endsWith('warning.html')) {
            return;
        }
        
        // Check if the tab has an allowance or if the URL is malicious
        if (tabAllowance[tabId] !== changeInfo.url && isMalicious(changeInfo.url)) {
            const warningUrl = chrome.runtime.getURL("warning.html") + "?redirect=" + encodeURIComponent(changeInfo.url);
            chrome.tabs.update(tabId, { url: warningUrl });
        }
    }
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    // Clean up the allowance when the tab is closed
    delete tabAllowance[tabId];
});

function checkUrlAndBlockIfNeeded(tabId, url) {
    // Load your bad URLs list into badUrls somehow, e.g., from a JSON file or directly as an array
    const isBadUrl = badUrls.some(badUrl => url.includes(badUrl));

    if (isBadUrl) {
        const warningUrl = chrome.runtime.getURL("warning.html") + "?redirect=" + encodeURIComponent(url);
        chrome.tabs.update(tabId, { url: warningUrl });
    }
}

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