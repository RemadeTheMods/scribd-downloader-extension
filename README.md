# SCRIBD DOWNLOADER

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

## Install

1. Extract ZIP file
2. Open `chrome://extensions`.
3. Turn on **Developer mode**.
4. Select **Load unpacked**.
5. Select the extracted folder.

## Sử dụng

- Mở trang cần chuyển thành PDF.
- Bấm icon extension → **Chạy tự động**.
- Extension sẽ xử lý URL, cuộn, dọn giao diện và mở Print.
- Trong Print chọn **Save as PDF**.
- Tắt **Headers and footers** và **Background graphics** nếu Chrome đang bật chúng.

## Lưu ý

Chrome không cho extension thông thường tự bấm các nút trong hộp thoại Print của hệ điều hành. Vì vậy bước cuối vẫn cần chọn **Save as PDF** và các tùy chọn in bằng tay.




