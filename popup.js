const runBtn = document.getElementById("run");
const printBtn = document.getElementById("print");
const statusEl = document.getElementById("status");

function setStatus(text) {
  statusEl.textContent = text;
}

async function currentTab() {
  const tabs = await chrome.tabs.query({active: true, currentWindow: true});
  return tabs[0];
}

async function run(mode) {
  runBtn.disabled = true;
  printBtn.disabled = true;
  try {
    const tab = await currentTab();
    if (!tab?.id) throw new Error("Không tìm thấy tab hiện tại.");

    if (mode === "full") {
      const result = await chrome.tabs.sendMessage(tab.id, {action: "transform-url"});
      if (result?.changed) {
        setStatus("Đã đổi URL. Đang chờ trang mới tải...");
        await new Promise(r => setTimeout(r, 2500));
      }
    }

    setStatus("Đang cuộn để tải toàn bộ nội dung...");
    await chrome.tabs.sendMessage(tab.id, {action: "clean-and-print"});
    setStatus("Đã dọn trang. Chrome sẽ mở hộp thoại In.");
  } catch (e) {
    // Một số trang chặn content script; thử inject trực tiếp.
    try {
      const tab = await currentTab();
      await chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ["content.js"]
      });
      await chrome.tabs.sendMessage(tab.id, {action: "clean-and-print"});
      setStatus("Đã chạy bằng chế độ dự phòng.");
    } catch (err) {
      setStatus("Không thể chạy trên trang này: " + err.message);
    }
  } finally {
    runBtn.disabled = false;
    printBtn.disabled = false;
  }
}

runBtn.addEventListener("click", () => run("full"));
printBtn.addEventListener("click", () => run("print"));

chrome.runtime.onMessage?.addListener?.(() => {});

chrome.commands?.onCommand?.addListener?.((command) => {
  if (command === "auto-pdf") run("full");
});