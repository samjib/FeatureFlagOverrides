chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (tab.id && (!tab.url || !tab.url.startsWith("chrome://"))) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["patch-fetch.js"],
          world: 'MAIN'
        });
      }
    }
  });
})

chrome.tabs.onCreated.addListener((tab) => {
  if (tab.id) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["patch-fetch.js"],
      world: 'MAIN'
    });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!tab.url || !tab.url.startsWith("chrome://")) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ["patch-fetch.js"],
      world: 'MAIN'
    });
  }
});
