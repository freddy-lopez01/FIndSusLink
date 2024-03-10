document.addEventListener('DOMContentLoaded', (event) => {
    const params = new URLSearchParams(window.location.search);
    const redirectUrl = params.get('redirect');
    
    if (redirectUrl) {
        // Set the text content of the element with ID 'redirectUrl' to the actual URL.
        document.getElementById('redirectUrl').textContent = decodeURIComponent(redirectUrl);
        
        // When the 'Proceed Anyway' button is clicked, redirect to the actual URL.
        document.getElementById('proceedButton').addEventListener('click', () => {
            window.location.href = decodeURIComponent(redirectUrl);
        });
    } else {
        // Log an error or display a message if no redirect URL is provided.
        console.error('No redirect URL provided');
    }
});

document.addEventListener('DOMContentLoaded', (event) => {
    const params = new URLSearchParams(window.location.search);
    const redirectUrl = params.get('redirect');
    
    if (redirectUrl) {
        const urlDisplayElement = document.getElementById('redirectUrl');
        urlDisplayElement.textContent = decodeURIComponent(redirectUrl);
        
        const proceedButton = document.getElementById('proceedButton');
        proceedButton.addEventListener('click', () => {
            window.location.href = decodeURIComponent(redirectUrl);
        });
        
        const cancelButton = document.getElementById('cancelButton');
        cancelButton.addEventListener('click', () => {
            window.close(); // Close the warning tab
        });
    } else {
        console.error('No redirect URL provided');
    }
});