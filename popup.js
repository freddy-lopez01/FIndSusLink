document.addEventListener('DOMContentLoaded', function() {
    var scanButton = document.getElementById('scanButton');
    scanButton.addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: 'scanTabs' });
    });
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.maliciousTabsInfo !== undefined) {
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
});
