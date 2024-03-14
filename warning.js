document.addEventListener('DOMContentLoaded', (event) => {
    const params = new URLSearchParams(window.location.search);
    const redirectUrl = params.get('redirect');
    
    if (redirectUrl) {
        const decodedUrl = decodeURIComponent(redirectUrl);
        document.getElementById('redirectUrl').textContent = decodedUrl;
        
        document.getElementById('proceedButton').addEventListener('click', () => {
            // Send a message to background.js to allow this URL for this tab
            chrome.runtime.sendMessage({ action: "allowUrl", url: decodedUrl }, () => {
                // Redirect to the decoded URL
                window.location.href = decodedUrl;
            });
        });
    } else {
        console.error('No redirect URL provided');
    }
});