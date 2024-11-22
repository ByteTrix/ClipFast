function copyUrlAndShowPopup(url) {

    // Function to create and show popup
    function createPopup() {
      const popup = document.createElement("div");
      popup.id = "url-popup";
      popup.style.position = "fixed";
      popup.style.top = "20px";
      popup.style.left = "50%";
      popup.style.transform = "translateX(-50%)";
      popup.style.background = "#ffffff";
      popup.style.border = "1px solid #e0e0e0";
      popup.style.borderRadius = "10px";
      popup.style.padding = "15px 20px";
      popup.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)";
      popup.style.zIndex = "10000";
      popup.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
      popup.style.fontSize = "16px";
      popup.style.color = "#333";
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
  
      document.body.appendChild(popup);
  
      const style = document.createElement('style');
      style.textContent = `
          @media (prefers-color-scheme: dark) {
              #url-popup {
                  background-color: #333; 
                  color: #fff; 
                  border: 1px solid #444; 
              }
              #share-button-container {
                  background-color: rgba(255, 255, 255, 0.1); 
              }
          }
      `;
      document.head.appendChild(style);
  
      setTimeout(() => {
          popup.style.opacity = "1";
          popup.style.transform = "translate(-50%, 0)";
      }, 100);
  
      const shareButtonContainer = document.getElementById("share-button-container");
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
              navigator.clipboard.writeText(url)
              .then(() => console.log("URL copied to clipboard."))
              .catch((error) => console.error("Error copying URL to clipboard:", error));
          }
      });
  
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
          createPopup();
      })
      .catch((error) => {
          console.error("Error copying URL to clipboard:", error);
      });
  }
  