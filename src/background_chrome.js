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
  
      // Send the URL to the content script to copy and show popup
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: copyUrlAndShowPopup,
        args: [urlToCopy]
      });
  
      showBadge(true);
    } catch (error) {
      console.error("Error executing script:", error);
      showBadge(false);
    }
  });
  
  // Combined function to copy URL and show popup
  function copyUrlAndShowPopup(url) {
  
    // Function to create and show the popup
    function createPopup() {
      // Remove any existing popups first
      const existingPopup = document.getElementById("url-popup");
      if (existingPopup) {
        existingPopup.remove();
      }
  
      // Dynamically create a popup element
      const popup = document.createElement("div");
      popup.id = "url-popup";
      popup.style.position = "fixed";
      popup.style.top = "20px";
      popup.style.left = "50%";
      popup.style.transform = "translateX(-50%)";
      popup.style.background = "#ffffff"; // Updated background color
      popup.style.border = "1px solid #e0e0e0"; // Light border for a cleaner look
      popup.style.borderRadius = "10px";
      popup.style.padding = "15px 20px";
      popup.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)"; // Softer shadow
      popup.style.zIndex = "10000";
      popup.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
      popup.style.fontSize = "16px";
      popup.style.color = "#333"; // Darker text color for better contrast
      popup.style.display = "flex";
      popup.style.alignItems = "center";
      popup.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      popup.style.opacity = "0";
      popup.style.transform = "translate(-50%, -20px)";
  
      // Add message and share icon container
      popup.innerHTML = `
          <span style="margin-right: 15px; font-weight: bold;">Copied Current URL</span>
          <div id="share-button-container" style="display: flex; align-items: center; justify-content: center; margin-left: auto; padding: 5px; border-radius: 50%; cursor: pointer; background-color: rgba(92, 45, 131, 0.1); width: 40px; height: 40px; transition: background-color 0.3s;">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#5c2d83">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
              </svg>
          </div>
      `;
  
      // Append the popup to the document body
      document.body.appendChild(popup);
  
      // Add style tag for dynamic theme
      const style = document.createElement('style');
      style.textContent = `
          @media (prefers-color-scheme: dark) {
              #url-popup {
                  background-color: #333; 
                  color: #fff; 
                  border: 1px solid #444; // Darker border for dark mode
              }
              #share-button-container {
                  background-color: rgba(255, 255, 255, 0.1); // Lighter background for dark mode
              }
          }
      `;
      document.head.appendChild(style);
  
      // Add animation after a short delay
      setTimeout(() => {
          popup.style.opacity = "1";
          popup.style.transform = "translate(-50%, 0)";
      }, 100);
  
      // Share button hover effect
      const shareButtonContainer = document.getElementById("share-button-container");
      shareButtonContainer.addEventListener("mouseover", () => {
          shareButtonContainer.style.backgroundColor = "rgba(92, 45, 131, 0.2)"; // Lighter background on hover
      });
      shareButtonContainer.addEventListener("mouseout", () => {
          shareButtonContainer.style.backgroundColor = "rgba(92, 45, 131, 0.1)"; // Reset background
      });
  
      // Share button click handler
      shareButtonContainer.addEventListener("click", () => {
          if (navigator.share) {
              navigator.share({
                  title: "Check out this URL",
                  text: "Here's a link you might find useful:",
                  url: url
              })
              .then(() => console.log("URL shared successfully."))
              .catch((error) => console.error("Error sharing URL:", error));
          } else {
              // Fallback: Copy URL to clipboard if sharing is not supported
              navigator.clipboard.writeText(url)
              .then(() => {
                  console.log("URL copied to clipboard.");
              })
              .catch((error) => console.error("Error copying URL to clipboard:", error));
          }
      });
  
      // Automatically close the popup after 5 seconds
      setTimeout(() => {
          if (document.body.contains(popup)) {
              popup.style.opacity = "0";
              popup.style.transform = "translate(-50%, -20px)";
              setTimeout(() => {
                  document.body.removeChild(popup);
              }, 300);
          }
      }, 5000);
    }
  
    // Copy URL to clipboard
    navigator.clipboard.writeText(url)
      .then(() => {
          console.log("URL copied to clipboard:", url);
          // Show popup after successful copy
          createPopup();
      })
      .catch((error) => {
          console.error("Error copying URL to clipboard:", error);
  
          // Fallback method if clipboard API fails
          try {
              // Create a temporary textarea to copy text
              const tempTextArea = document.createElement('textarea');
              tempTextArea.value = url;
              document.body.appendChild(tempTextArea);
              tempTextArea.select();
              document.execCommand('copy');
              document.body.removeChild(tempTextArea);
  
              console.log("URL copied using fallback method");
              createPopup();
          } catch (fallbackError) {
              console.error("Fallback copy method failed:", fallbackError);
          }
      });
  }
  