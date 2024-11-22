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
      console.error("Cannot perform actions on restricted pages.");
      showBadge(false);
      return;
    }

    // Send the URL and action to the content script to display the popup
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: showPopup,
      args: [urlToCopy]
    });
    showBadge(true);
  } catch (error) {
    console.error("Error executing script:", error);
    showBadge(false);
  }
});

// Function to show popup (used in content script)
function showPopup(url) {
  // Dynamically create a popup element
  const popup = document.createElement("div");
  popup.id = "url-popup";
  popup.style.position = "fixed";
  popup.style.top = "20px"; // Ensure it's positioned in the top-left corner
  popup.style.left = "20px";
  popup.style.background = "#333"; // Dark background
  popup.style.color = "#fff"; // White text
  popup.style.border = "1px solid #ccc";
  popup.style.borderRadius = "8px";
  popup.style.padding = "15px 20px"; // Add some padding for spacing
  popup.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  popup.style.zIndex = "10000";
  popup.style.fontFamily = "'Arial', sans-serif"; // Use a clean font
  popup.style.fontSize = "14px"; // Adjust font size for readability
  popup.style.maxWidth = "300px"; // Limit the width to prevent overflow
  popup.style.transition = "opacity 0.3s ease"; // Smooth transition for fading out
  popup.style.margin = "0"; // Reset margin to avoid unwanted space around the popup

  // Add message and buttons
  popup.innerHTML = `
    <p style="margin: 0 0 10px; font-weight: bold;">URL copied to clipboard!</p>
    <button id="share-button" style="background-color: #4CAF50; color: #fff; border: none; border-radius: 5px; padding: 8px 12px; cursor: pointer; margin-right: 5px;">Share</button>
    <button id="close-popup" style="background-color: #f44336; color: #fff; border: none; border-radius: 5px; padding: 8px 12px; cursor: pointer;">Close</button>
  `;

  // Append the popup to the document body
  document.body.appendChild(popup);

  // Close button handler
  document.getElementById("close-popup").onclick = () => {
    document.body.removeChild(popup);
  };

  // Share button handler
  document.getElementById("share-button").onclick = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this URL",
          text: "Here's a link you might find useful:",
          url: url
        })
        .then(() => console.log("URL shared successfully."))
        .catch((error) => console.error("Error sharing URL:", error));
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };

  // Automatically close the popup after 5 seconds
  setTimeout(() => {
    if (document.body.contains(popup)) {
      document.body.removeChild(popup);
    }
  }, 5000);
}
