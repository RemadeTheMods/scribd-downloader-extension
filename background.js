async function getActiveTab() {
  const tabs = await chrome.tabs.query({active: true, currentWindow: true});
  return tabs[0];
}

async function runAuto(tabId) {
  try {
    const result = await chrome.tabs.sendMessage(tabId, {action: "transform-url"});
    if (result?.changed) {
      // Sau navigation, content.js được nạp lại.
      await new Promise(r => setTimeout(r, 2500));
    }
    await chrome.tabs.sendMessage(tabId, {action: "clean-and-print"});
  } catch (e) {
    try {
      await chrome.scripting.executeScript({
        target: {tabId},
        files: ["content.js"]
      });
      await chrome.tabs.sendMessage(tabId, {action: "clean-and-print"});
    } catch (_) {}
  }
}

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "auto-pdf") return;
  const tab = await getActiveTab();
  if (tab?.id) await runAuto(tab.id);
});