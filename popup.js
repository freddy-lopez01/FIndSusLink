document.addEventListener('DOMContentLoaded', function() {
    var closeButton = document.getElementById('closeButton');
    var scanButton = document.getElementById('scanButton');
    var proceedButton = document.getElementById('proceedButton');

    // Set up a connection to the background page
    var port = chrome.runtime.connect({name: "popup"});

    scanButton.addEventListener('click', function() {
        port.postMessage({ action: 'scanTabs' });
    });

    closeButton.addEventListener('click', function() {
        window.close(); // Closes the popup
    });

    proceedButton.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const currentTab = tabs[0];
            chrome.tabs.update(currentTab.id, { url: document.getElementById('urlWarning').textContent });
        });
    });

    port.onMessage.addListener(function(message) {
        if (message.maliciousTabsInfo) {
            // Process message.maliciousTabsInfo
            let alertMessage = 'Scan complete!\n';
            if (message.maliciousTabsInfo.length > 0) {
                alertMessage += 'Malicious tabs found:\n';
                message.maliciousTabsInfo.forEach(tabInfo => {
                    alertMessage += `${tabInfo.title}: ${tabInfo.url}\n`;
                });
            } else {
                alertMessage += 'No malicious tabs found.';
            }
            alert(alertMessage);
        }
        if (message.action === "showWarning") {
            document.getElementById('securityWarning').style.display = 'block';
            document.getElementById('urlWarning').textContent = message.url;
        }
    });
});
