/// Function to show badge feedback
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

// Function to save the URL to a file
function saveToFile(url) {
  const blob = new Blob([url + "\n"], { type: "text/plain" });
  const fileUrl = URL.createObjectURL(blob);

  chrome.downloads.download({
    url: fileUrl,
    filename: "saved_urls.txt",
    saveAs: true
  }, () => {
    console.log("URL saved to file:", url);
  });
}

// Function to share the URL (fallback alert for unsupported platforms)
function shareURL(url) {
  if (navigator.share) {
    navigator.share({
      title: "Check out this URL",
      text: "Here's a link you might find useful:",
      url: url
    }).then(() => {
      console.log("URL shared successfully.");
    }).catch((error) => {
      console.error("Error sharing URL:", error);
    });
  } else {
    alert("Sharing is not supported on this browser.");
  }
}

// Main click handler
chrome.action.onClicked.addListener(async (tab) => {
  try {
    const urlToCopy = tab.url;

    // Block restricted URLs
    const restricted = ["chrome://", "chromewebstore.google.com"];
    if (restricted.some((restrictedURL) => urlToCopy.startsWith(restrictedURL))) {
      console.error("Cannot perform actions on restricted pages.");
      showBadge(false);
      return;
    }

    // Menu for selecting actions
    const action = prompt(
      "Choose an action:\n1. Copy URL\n2. Save URL\n3. Share URL",
      "1"
    );

    switch (action) {
      case "1":
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (text) => navigator.clipboard.writeText(text),
          args: [urlToCopy],
        });
        showBadge(true);
        break;
      case "2":
        saveToFile(urlToCopy);
        break;
      case "3":
        shareURL(urlToCopy);
        break;
      default:
        console.log("No valid action selected.");
    }
  } catch (error) {
    console.error("Error handling action:", error);
    showBadge(false);
  }
});
