# 🎬 CinemaX – Website Đặt Vé Xem Phim

Dự án website đặt vé xem phim đầy đủ, responsive, xây dựng bằng **HTML5 + CSS3 + Bootstrap 5 + Vanilla JavaScript**.

---

## 📁 Cấu Trúc Thư Mục

```
CinemaX/
├── index.html          ← Trang chủ (hero slider, phim đang chiếu, rạp, ưu đãi)
├── movies.html         ← Danh sách tất cả phim + bộ lọc tìm kiếm
├── movie-detail.html   ← Chi tiết phim (nội dung, diễn viên, đánh giá, đặt vé nhanh)
├── booking.html        ← Đặt vé: chọn ngày, rạp, suất, ghế, combo bắp nước
├── payment.html        ← Thanh toán: thông tin khách, phương thức, xác nhận
├── confirmation.html   ← Trang xác nhận đặt vé thành công + mã QR
├── promotions.html     ← Ưu đãi, khuyến mãi, thẻ thành viên
├── account.html        ← Đăng nhập / Đăng ký / Hồ sơ / Lịch sử đặt vé
│
├── css/
│   ├── style.css       ← CSS chính: biến màu, navbar, hero, card, footer...
│   └── components.css  ← CSS trang đặt vé: seat map, form, payment, confirmation
│
└── js/
    ├── data.js         ← Dữ liệu phim, rạp, giá vé, combo (dùng chung)
    ├── main.js         ← Logic trang chủ: slider, render phim, rạp, ưu đãi
    └── booking.js      ← Logic đặt vé: chọn ghế, snack, thanh toán, xác nhận
```

---

## 🚀 Cách Chạy

### Cách 1 – Mở Trực Tiếp (đơn giản nhất)
1. Giải nén folder `CinemaX`
2. Mở `index.html` bằng trình duyệt Chrome / Edge / Firefox
3. **Lưu ý:** Một số tính năng (fonts Google) cần kết nối internet

### Cách 2 – Visual Studio Code (khuyến nghị)
1. Mở VS Code → `File > Open Folder` → Chọn thư mục `CinemaX`
2. Cài extension **Live Server** (ritwickdey.LiveServer)
3. Chuột phải vào `index.html` → **Open with Live Server**
4. Trình duyệt tự mở tại `http://127.0.0.1:5500`

---

## 🖥️ Công Nghệ Sử Dụng

| Công Nghệ | Mục Đích |
|-----------|----------|
| HTML5 | Cấu trúc trang |
| CSS3 Custom Properties | Theme, animation, responsive |
| Bootstrap 5.3 | Grid layout, components |
| Bootstrap Icons 1.11 | Icon toàn trang |
| Vanilla JavaScript (ES6+) | Logic động, không cần framework |
| LocalStorage | Lưu trạng thái đặt vé tạm thời |
| Google Fonts (Montserrat + Roboto) | Typography |

> Bootstrap & Icons được load từ CDN – cần internet lần đầu.

---

## 📱 Responsive

Website tương thích đầy đủ:
- ✅ Desktop (1920px, 1440px, 1280px)
- ✅ Laptop (1024px)
- ✅ Tablet (768px)
- ✅ Mobile (480px, 375px)

---

## 🎯 Luồng Đặt Vé

```
index.html
    ↓ Chọn phim
movie-detail.html  ←→  movies.html
    ↓ Bấm "Đặt Vé Ngay"
booking.html  (Bước 1: Chọn ngày + rạp + suất + ghế + combo)
    ↓ Tiếp tục
payment.html  (Bước 2: Điền thông tin + chọn thanh toán)
    ↓ Thanh toán
confirmation.html  (Bước 3: Mã vé + chi tiết + in vé)
```

---

## ✨ Tính Năng Nổi Bật

- **Hero Slider** tự động chuyển 5 giây, có nút điều hướng
- **Tìm kiếm nhanh** phim + rạp + ngày ngay trang chủ
- **Sơ đồ ghế** tương tác: ghế thường / VIP / đã đặt / đang chọn
- **Combo bắp nước** với bộ đếm số lượng
- **6 phương thức thanh toán**: MoMo, VNPay, ZaloPay, ATM, Visa, Tiền mặt
- **Mã giảm giá**: thử `CINEMEX20`, `THUBA`, `MORNING50`
- **Toast notification** phản hồi mọi thao tác
- **Trang ưu đãi** với đồng hồ đếm ngược flash sale
- **Trang tài khoản** đăng nhập/đăng ký + lịch sử vé
- **In vé** trực tiếp từ trang xác nhận (Ctrl+P)
- **Scroll to top** button

---

## 🎨 Bảng Màu

| Tên | Màu | Dùng Cho |
|-----|-----|----------|
| Red | `#e50914` | Primary, CTA, active |
| Gold | `#f5c518` | Rating, VIP, highlight |
| Dark | `#0d0d0d` | Background chính |
| Dark2 | `#141414` | Section alternate |
| Dark3 | `#1e1e1e` | Card background |

---

## 📝 Ghi Chú

- Tất cả dữ liệu phim, rạp, giá vé đều nằm trong `js/data.js` – chỉnh sửa tại đây
- LocalStorage được dùng để truyền dữ liệu giữa các trang (booking → payment → confirmation)
- Không cần server hay database – chạy hoàn toàn phía client

---

*CinemaX © 2025 – Dự án học tập HTML/CSS/JS*
