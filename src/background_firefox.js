// Popup creation function for Firefox
function createPopup(url) {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      if (tabs.length > 0 && tabs[0].url.startsWith("http")) {
          browser.tabs.executeScript(tabs[0].id, {
              code: `
                  (function() {
                      // Ensure DOM is loaded
                      if (document.readyState === "loading") {
                          document.addEventListener("DOMContentLoaded", createPopup);
                      } else {
                          createPopup();
                      }

                      function createPopup() {
                          // Remove existing popup
                          const existingPopup = document.getElementById("url-popup");
                          if (existingPopup) {
                              existingPopup.remove();
                          }

                          // Create popup element
                          const popup = document.createElement("div");
                          popup.id = "url-popup";
                          popup.style.position = "fixed";
                          popup.style.top = "15px";
                          popup.style.left = "50%";
                          popup.style.transform = "translateX(-50%)";
                          popup.style.background = "rgba(30, 30, 30, 0.95)";
                          popup.style.backdropFilter = "blur(15px)";
                          popup.style.border = "1px solid rgba(255, 255, 255, 0.1)";
                          popup.style.borderRadius = "12px";
                          popup.style.padding = "12px 16px";
                          popup.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.1)";
                          popup.style.zIndex = "10000";
                          popup.style.fontFamily = "'Roboto', 'Arial', sans-serif";
                          popup.style.fontSize = "15px";
                          popup.style.color = "#fff"; // white text for dark mode
                          popup.style.display = "flex";
                          popup.style.alignItems = "center";
                          popup.style.transition = "opacity 0.3s ease, transform 0.3s ease";
                          popup.style.opacity = "0";
                          popup.style.transform = "translate(-50%, -20px)";
                          popup.style.maxWidth = "320px";
                          popup.style.width = "fit-content";

                          popup.innerHTML = \`
                              <span style="margin-right: 12px; font-weight: 600; opacity:  0.9;">Copied Current URL</span>
                              <div id="share-button-container" class="share-button-container">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#ffffff">
                                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79  0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                                  </svg>
                              </div>
                          \`;

                          document.body.appendChild(popup);

                          const style = document.createElement('style');
                          style.textContent = \`
                              #url-popup {
                                  position: fixed;
                                  top: 15px;
                                  left: 50%;
                                  transform: translateX(-50%);
                                  background: rgba(30, 30, 30, 0.95);
                                  backdrop-filter: blur(15px);
                                  border: 1px solid rgba(255, 255, 255, 0.1);
                                  border-radius: 12px;
                                  padding: 12px 16px;
                                  box-shadow: 0 8px 20px rgba(0, 0,  0, 0.1);
                                  z-index: 10000;
                                  font-family: 'Roboto', 'Arial', sans-serif;
                                  font-size: 15px;
                                  color: #fff;
                                  display: flex;
                                  align-items: center;
                                  transition: opacity 0.4s ease, transform 0.4s ease, scale 0.3s ease;
                                  opacity: 0;
                                  transform: translate(-50%, -20px) scale(0.95);
                                  max-width: 320px;
                                  width: fit-content;
                              }

                              #share-button-container {
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
                              }

                              #share-button-container:hover {
                                  background-color: rgb(75, 35, 60);
                                  transform: scale(1.1);
                              }

                              @media (prefers-color-scheme: dark) {
                                  #url-popup {
                                      background-color: rgba(30, 30, 30, 0.95);
                                      color: #fff;
                                      border: 1px solid rgba(255, 255, 255, 0.1);
                                  }

                                  #share-button-container {
                                      background-color: rgb(90, 41, 76);
                                      border: 1px solid rgba(255, 255, 255, 0.1);
                                  }
                              }
                          \`;
                          document.head.appendChild(style);

                          // Show the popup
                          setTimeout(() => {
                              popup.style.opacity = "1";
                              popup.style.transform = "translate(-50%, 0)";
                          }, 100);

                          // Automatically hide the popup after 3 seconds
                          setTimeout(() => {
                              popup.style.opacity = "0";
                              popup.style.transform = "translate(-50%, -20px)";
                              setTimeout(() => {
                                  popup.remove();
                              }, 300); // Match with CSS transition duration
                          }, 3000); // Adjust time as necessary

                          // Add click event to close popup
                          popup.addEventListener("click", () => {
                              popup.style.opacity = "0";
                              popup.style.transform = "translate(-50%, -20px)";
                              setTimeout(() => {
                                  popup.remove();
                              }, 300); // Match with CSS transition duration
                          });

                          const shareButtonContainer = document.getElementById("share-button-container");

                          shareButtonContainer.addEventListener("click", () => {
                              console.log("Share button clicked");
                              if (navigator.share) {
                                  navigator.share({
                                      title: "Check out this URL",
                                      text: "Here's a link you might find useful:",
                                      url: url
                                  })
                                  .then(() => console.log("URL shared successfully."))
                                  .catch((error) => console.error("Error sharing URL:", error));
                              } else {
                                  console.log("Web Share API not supported, copying to clipboard instead.");
                                  navigator.clipboard.writeText(url)
                                  .then(() => {
                                      console.log("URL copied to clipboard.");
                                  })
                                  .catch((error) => console.error("Error copying URL to clipboard:", error));
                              }
                          });
                      }
                  })();
              `
}).catch((error) => {
              console.error("Error executing script:", error);
          });
      } else {
          console.warn("Popup skipped: Non-webpage tab or invalid URL.");
      }
  });
}

// Clipboard copy function
async function copyToClipboard(text) {
  try {
      await navigator.clipboard.writeText(text);
      return true;
  } catch (error) {
      console.error('Clipboard copy failed:', error);
      return false;
  }
}

// Main click handler
browser.browserAction.onClicked.addListener(async (tab) => {
  try {
      // Copy URL to clipboard
      const success = await copyToClipboard(tab.url);
      
      if (success) {
          // Show success badge
          browser.browserAction.setBadgeText({ text: "✓" });
          browser.browserAction.setBadgeBackgroundColor({ color: "#4CAF50" });
          
          // Create popup
          createPopup(tab.url);
      } else {
          // Show error badge
          browser.browserAction.setBadgeText({ text: "!" });
          browser.browserAction.setBadgeBackgroundColor({ color: "#FF0000" });
      }

      // Clear badge after 1.5 seconds
      setTimeout(() => {
          browser.browserAction.setBadgeText({ text: "" });
      }, 1500);

  } catch (error) {
      console.error('Error in extension:', error);
  }
});