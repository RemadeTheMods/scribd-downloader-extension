(() => {
  if (window.__autoPdfCleanerLoaded) return;
  window.__autoPdfCleanerLoaded = true;

  const REMOVE_SELECTORS = [
    "document_scroller",
    "toolbar_drop",
    "mobile_overlay"
  ];

  // Xóa CLASS theo đúng yêu cầu: giữ nguyên thẻ HTML, chỉ làm class="".
  // Ví dụ: <div class="document_scroller"> -> <div class="">.
  // Không remove element để tránh làm thay đổi cấu trúc/nội dung viewer.
  function clearTargetClasses() {
    const cleared = [];

    for (const name of REMOVE_SELECTORS) {
      document.querySelectorAll(`.${CSS.escape(name)}`).forEach(el => {
        // Chỉ xóa class mục tiêu, giữ nguyên thẻ và các class khác nếu có.
        el.classList.remove(name);
        cleared.push(name);
      });
    }

    return cleared.length;
  }

  function transformDocumentUrl() {
    const url = new URL(location.href);
    const old = url.href;

    // Scribd document URL:
    // https://www.scribd.com/document/809317740/anything
    //
    // Becomes:
    // https://www.scribd.com/embeds/809317740/content?start_page=1&view_mode=scroll&access_key=key-1
    //
    // Only transforms normal /document/<numeric-id>/... URLs.
    // It does not attempt to bypass login, paywalls, permissions, or other access controls.
    if (url.hostname !== "www.scribd.com" && url.hostname !== "scribd.com") {
      return {changed: false, old, newUrl: old};
    }

    const match = url.pathname.match(/^\/document\/(\d+)(?:\/|$)/i);
    if (!match) {
      // Also support an already-transformed /embeds/<id>/ URL.
      const embedMatch = url.pathname.match(/^\/embeds\/(\d+)\/content\/?$/i);
      if (embedMatch) {
        const id = embedMatch[1];
        const target = new URL(`https://www.scribd.com/embeds/${id}/content`);
        target.searchParams.set("start_page", "1");
        target.searchParams.set("view_mode", "scroll");
        target.searchParams.set("access_key", "key-1");
        const newUrl = target.href;
        if (newUrl !== old) {
          location.href = newUrl;
          return {changed: true, old, newUrl};
        }
      }
      return {changed: false, old, newUrl: old};
    }

    const id = match[1];
    const target = new URL(`https://www.scribd.com/embeds/${id}/content`);
    target.searchParams.set("start_page", "1");
    target.searchParams.set("view_mode", "scroll");
    target.searchParams.set("access_key", "key-1");

    const newUrl = target.href;
    if (newUrl === old) return {changed: false, old, newUrl: old};

    location.href = newUrl;
    return {changed: true, old, newUrl};
  }

  async function scrollToBottomAndBack() {
    // Cuộn từng đoạn để kích hoạt lazy-loading.
    let lastHeight = 0;
    let stable = 0;

    for (let i = 0; i < 40 && stable < 4; i++) {
      window.scrollTo({top: document.documentElement.scrollHeight, behavior: "auto"});
      await new Promise(r => setTimeout(r, 350));

      const h = document.documentElement.scrollHeight;
      if (h === lastHeight) stable++;
      else stable = 0;
      lastHeight = h;
    }

    // Chạm các mốc giữa trang để trigger lazy-load ở viewer.
    const height = document.documentElement.scrollHeight;
    for (const ratio of [0.25, 0.5, 0.75, 1]) {
      window.scrollTo({top: Math.max(0, height * ratio), behavior: "auto"});
      await new Promise(r => setTimeout(r, 250));
    }

    window.scrollTo({top: 0, behavior: "auto"});
    await new Promise(r => setTimeout(r, 250));
  }

  async function cleanAndPrint() {
    await scrollToBottomAndBack();
    clearTargetClasses();

    // CSS tạm thời để khi in không lấy các thanh công cụ/overlay.
    const style = document.createElement("style");
    style.id = "__autoPdfPrintStyle";
    style.textContent = `
      @media print {
        /* Sau khi class được làm rỗng, không ẩn chính các thẻ viewer. */
        [data-testid="toolbar_drop"],
        [data-testid="mobile_overlay"] {
          display: none !important;
        }
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `;
    document.head.appendChild(style);

    await new Promise(r => setTimeout(r, 300));
    window.print();
  }

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "transform-url") {
      sendResponse(transformDocumentUrl());
      return true;
    }

    if (msg.action === "clean-and-print") {
      cleanAndPrint()
        .then(() => sendResponse({ok: true}))
        .catch(err => sendResponse({ok: false, error: err.message}));
      return true;
    }
  });

  // Cho phép chạy lại bằng cách gửi message sau khi navigation hoàn tất.
  window.autoPdfCleaner = {transformDocumentUrl, cleanAndPrint, clearTargetClasses};
})();