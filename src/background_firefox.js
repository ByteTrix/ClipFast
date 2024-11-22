// Function to show badge feedback
function showBadge(success = true) {
    browser.browserAction.setBadgeText({
      text: success ? "✓" : "!"
    });
    browser.browserAction.setBadgeBackgroundColor({
      color: success ? "#4CAF50" : "#FF0000"
    });
    setTimeout(() => {
      browser.browserAction.setBadgeText({ text: "" });
    }, 1500);
  }
  
  // Function to copy text to clipboard
  async function copyToClipboard(text) {
    try {
      // Primary method: Using clipboard API
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Primary copy method failed:', error);
      
      try {
        // Fallback method: Using execCommand
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      } catch (fallbackError) {
        console.error('Fallback copy method failed:', fallbackError);
        throw fallbackError;
      }
    }
  }
  
  // Main click handler
  browser.browserAction.onClicked.addListener(async (tab) => {
    try {
      // Get the current tab's URL
      const urlToCopy = tab.url;
  
      // Try copying in the background script first
      try {
        await copyToClipboard(urlToCopy);
        showBadge(true);
      } catch (backgroundError) {
        console.error('Background copy failed:', backgroundError);
        
        // Fallback: Try copying in the content script
        try {
          await browser.tabs.executeScript(tab.id, {
            code: `
              (async () => {
                try {
                  await navigator.clipboard.writeText("${urlToCopy.replace(/"/g, '\\"')}");
                  return true;
                } catch (e) {
                  try {
                    const textArea = document.createElement('textarea');
                    textArea.value = "${urlToCopy.replace(/"/g, '\\"')}";
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    return true;
                  } catch (fallbackError) {
                    throw fallbackError;
                  }
                }
              })();
            `
          });
          showBadge(true);
        } catch (contentError) {
          console.error('Content script copy failed:', contentError);
          showBadge(false);
        }
      }
    } catch (error) {
      console.error('Error copying URL:', error);
      showBadge(false);
    }
  });