// Function to show badge feedback
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

// Main click handler for the extension icon
chrome.action.onClicked.addListener(async (tab) => {
  try {
    const urlToCopy = tab.url;

    // Check if the current page URL is from a restricted domain (e.g., chrome:// URLs)
    if (urlToCopy.includes("chromewebstore.google.com") || urlToCopy.startsWith("chrome://")) {
      console.error("Cannot copy URL from restricted pages.");
      showBadge(false);
      return;
    }

    // Send the URL to the content script to copy it to clipboard
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: copyToClipboard,
      args: [urlToCopy]
    });
    showBadge(true);
  } catch (error) {
    console.error('Error copying URL:', error);
    showBadge(false);
  }
});

// Function to copy text to clipboard (used in the content script)
async function copyToClipboard(text) {
  // First, try using the Clipboard API
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Clipboard API failed:', error);
      return false;
    }
  }

  // If Clipboard API fails, fall back to using execCommand
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  } catch (fallbackError) {
    console.error('Fallback copy method failed:', fallbackError);
    return false;
  }
}
