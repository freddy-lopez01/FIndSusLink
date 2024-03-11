document.addEventListener('DOMContentLoaded', (event) => {
    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    window.addEventListener('scroll', function() {
        let st = window.pageYOffset || document.documentElement.scrollTop;
        if (st > lastScrollTop){
            // Code to detect pop-ups when scrolling down
            checkForPopups();
        } else {
            // Optionally, handle scrolling up differently
        }
        lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
    }, false);
});

function checkForPopups() {
    // TODO: Implement logic to check for pop-ups

    // Example: Check for new elements with certain IDs, classes, or attributes
    const popups = document.querySelectorAll('.popup, .modal, [role="dialog"]');
    popups.forEach(popup => {
        if (isMalicious(popup)) {
            console.log('Malicious popup detected:', popup);
            popup.style.display = 'none'; // Example: Hiding the popup
        }
    });
}

function isMalicious(popup) {
    // TODO: Implement logic to determine if popup is malicious
    // Example:
    return popup.innerHTML.includes('malicious content keyword');
}