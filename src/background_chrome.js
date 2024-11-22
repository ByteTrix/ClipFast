
function showBadge(success = true) {
    chrome.action.setBadgeText({
        text: success ? "✓" : "!"
    });
    chrome.action.setBadgeBackgroundColor({
        color: success ? "#4CAF50" : "#FF0000"
    });
    setTimeout(() => {
        chrome.action.setBadgeText({ text: "" });
    }, 1500);
}

chrome.action.onClicked.addListener(async (tab) => {
    try {
        const urlToCopy = tab.url;

        if (urlToCopy.includes("chromewebstore.google.com") || urlToCopy.startsWith("chrome://")) {
            console.error("Cannot perform actions on restricted pages.");
            showBadge(false);
            return;
        }

        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['urlpopup.js'] 
        });

        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (url) => {
                copyUrlAndShowPopup(url);
            },
            args: [urlToCopy]
        });

        showBadge(true);
    } catch (error) {
        console.error("Error executing script:", error);
        showBadge(false);
    }
});