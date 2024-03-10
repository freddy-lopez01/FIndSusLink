let badUrls = [];

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
    return badUrls.some(badUrl => url.includes(badUrl));
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

loadBadUrls();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'loading' && changeInfo.url && !changeInfo.url.startsWith('https://')) {
        // Check if the URL is non-HTTPS and not in the bad URLs list
        if (!isMalicious(changeInfo.url)) {
            try {
                chrome.runtime.sendMessage({
                    action: "showWarning",
                    url: changeInfo.url
                });
            } catch (e) {
                console.error('Error sending message to popup:', e);
            }
        }
    }
});

// This function will be serialized and executed in the context of the webpage
function showAlert() {
    alert('Warning: You are attempting to access a non-HTTPS site. This may not be secure.');
}

function checkUrlAndBlockIfNeeded(tabId, url) {
    // Load your bad URLs list into badUrls somehow, e.g., from a JSON file or directly as an array
    const badUrls = ["list", "of", "bad", "urls"]; // Simplified example
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