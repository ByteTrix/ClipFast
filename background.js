chrome.browserAction.onClicked.addListener((tab) => {
  if (tab.url) {
    // Use Clipboard API to copy URL
    navigator.clipboard.writeText(tab.url).then(() => {
      console.log(`URL copied: ${tab.url}`);
    }).catch((err) => {
      console.error("Failed to copy URL: ", err);
    });
  }
});
