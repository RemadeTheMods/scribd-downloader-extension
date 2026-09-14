# Auto PDF Cleaner

Extension Chrome Manifest V3 để tự động hóa quy trình:

1. Đổi `document` trong URL thành `embeds`.
2. Thêm `/content` vào cuối URL.
3. Cuộn xuống cuối trang để kích hoạt lazy-loading.
4. Xóa:
   - `document_scroller`
   - `toolbar_drop`
   - `mobile_overlay`
5. Mở cửa sổ **Print**.

## Cài đặt

1. Giải nén file ZIP.
2. Mở `chrome://extensions`.
3. Bật **Developer mode**.
4. Chọn **Load unpacked**.
5. Chọn thư mục `auto-pdf-extension`.

## Sử dụng

- Mở trang cần chuyển thành PDF.
- Bấm icon extension → **Chạy tự động**.
- Extension sẽ xử lý URL, cuộn, dọn giao diện và mở Print.
- Trong Print chọn **Save as PDF**.
- Tắt **Headers and footers** và **Background graphics** nếu Chrome đang bật chúng.

## Lưu ý

Chrome không cho extension thông thường tự bấm các nút trong hộp thoại Print của hệ điều hành. Vì vậy bước cuối vẫn cần chọn **Save as PDF** và các tùy chọn in bằng tay.

Nếu cấu trúc trang của bạn dùng selector khác với ba tên trong hướng dẫn, hãy thêm selector vào `REMOVE_SELECTORS` trong `content.js`.


## Scribd URL conversion

The extension now recognizes URLs such as:

`https://www.scribd.com/document/809317740/11-%C4%90%E1%BB%81-HSG-V%E1%BA%ADt-L%C3%BD-12-Ph%E1%BA%A7n-tr%E1%BA%AFc-nghi%E1%BB%87m-S%E1%BB%9F-GD-%C4%90T-Ngh%E1%BB%87-An-1`

and changes them to:

`https://www.scribd.com/embeds/809317740/content?start_page=1&view_mode=scroll&access_key=key-1`

The numeric Scribd document ID is extracted automatically, so the rule also works for other Scribd `/document/<id>/...` URLs. The extension does not bypass login, paywalls, permissions, or other access controls.


## Thay đổi v1.3
- Khi gặp `document_scroller`, `toolbar_drop`, `mobile_overlay`, extension **không xóa thẻ HTML**. Nó chỉ đổi `class` của thẻ thành chuỗi rỗng.
- Ví dụ: `<div class="document_scroller">` → `<div class="">`.
- Sau khi tải nội dung, extension tự gọi `window.print()` để mở giao diện In.
- Lưu ý: Chrome không cho extension điều khiển trực tiếp các lựa chọn trong hộp thoại Print Preview của trình duyệt (như Save as PDF / Even pages only). Vì vậy các lựa chọn đó vẫn cần được chọn trong giao diện in nếu Chrome hiển thị chúng.
