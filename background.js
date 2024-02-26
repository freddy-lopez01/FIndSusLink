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
        chrome.runtime.sendMessage({ maliciousTabsInfo });
    });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'scanTabs') {
        scanTabs();
    }
});

loadBadUrls();

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    const urlToCheck = details.url;
    if (badUrls.includes(urlToCheck)) {
      // You can redirect to a warning page or block the navigation here
      // For example:
      chrome.tabs.update(details.tabId, {
        url: chrome.runtime.getURL("warning.html") + "?redirect=" + encodeURIComponent(urlToCheck),
      });
    }
  }, { url: [{ urlMatches: 'http://*/*' }, { urlMatches: 'https://*/*' }] });

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Ensure we check when the URL of a tab changes
    if (changeInfo.url) {
        checkUrlAndBlockIfNeeded(tabId, changeInfo.url);
    }
});

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