// Clipboard copy function
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error("Clipboard copy failed:", error);
        return false;
    }
}

// Popup creation function
function createPopup(url) {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        if (tabs.length > 0 && tabs[0].url.startsWith("http")) {
            browser.tabs.executeScript({
                code: `
                    (function() {
                        const currentUrl = decodeURIComponent(${JSON.stringify(encodeURIComponent(url))});
                        
                        // Remove existing popup
                        const existingPopup = document.getElementById("url-popup");
                        if (existingPopup) existingPopup.remove();

                        // Create popup element
                        const popup = document.createElement("div");
                        popup.id = "url-popup";
                        popup.style.cssText = \`
                            position: fixed;
                            top: 15px;
                            left: 50%;
                            transform: translate(-50%, -20px);
                            background: rgba(30, 30, 30, 0.95);
                            backdrop-filter: blur(15px);
                            border: 1px solid rgba(255, 255, 255, 0.1);
                            border-radius: 12px;
                            padding: 12px 16px;
                            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
                            z-index: 10000;
                            font-family: 'Roboto', 'Arial', sans-serif;
                            font-size: 15px;
                            color: #fff;
                            display: flex;
                            align-items: center;
                            transition: opacity 0.3s ease, transform 0.3s ease;
                            opacity: 0;
                            max-width: 320px;
                            width: fit-content;
                        \`;

                        popup.innerHTML = \`
                            <span style="margin-right: 12px; font-weight: 600;">Copied Current URL</span>
                            <div id="share-button-container" style="
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                margin-left: auto;
                                padding: 5px;
                                border-radius: 50%;
                                cursor: pointer;
                                background-color: rgb(90, 41, 76);
                                width: 32px;
                                height: 32px;
                                transition: background-color 0.3s, transform 0.3s ease;
                                border: 1px solid rgba(255, 255, 255, 0.1);
                            ">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#ffffff">
                                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                                </svg>
                            </div>
                        \`;

                        document.body.appendChild(popup);

                        // Animate in
                        setTimeout(() => {
                            popup.style.opacity = "1";
                            popup.style.transform = "translate(-50%, 0)";
                        }, 100);

                        // Animate out
                        setTimeout(() => {
                            popup.style.opacity = "0";
                            setTimeout(() => popup.remove(), 300);
                        }, 3000);

                        // Share button handler
                        document.getElementById("share-button-container").addEventListener("click", () => {
                            browser.runtime.sendMessage({
                                action: "openSharePage",
                                url: currentUrl
                            });
                        });
                    })();
                `
            }).catch(console.error);
        }
    });
}

// Handle messages from content script
browser.runtime.onMessage.addListener((message) => {
    if (message.action === "openSharePage") {
        const shareUrl = browser.runtime.getURL("share.html") + "?url=" + encodeURIComponent(message.url);
        
        // Add these parameters for popup window
        browser.windows.create({
            url: shareUrl,
            type: "popup",
            width: 400,
            height: 300,
            left: Math.round(screen.width - 420),  // Right side positioning
            top: 100
        });
    }
});

// Main click handler
browser.browserAction.onClicked.addListener(async (tab) => {
    try {
        const success = await copyToClipboard(tab.url);
        createPopup(tab.url);

        // Update badge
        browser.browserAction.setBadgeText({
            text: success ? "✓" : "!"
        });
        browser.browserAction.setBadgeBackgroundColor({
            color: success ? "#4CAF50" : "#FF0000"
        });

        setTimeout(() => {
            browser.browserAction.setBadgeText({ text: "" });
        }, 1500);
    } catch (error) {
        console.error("Error handling click:", error);
    }
});