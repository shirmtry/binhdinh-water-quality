# binhdinh-water-quality — Chất lượng nước giếng Bình Định sau lũ 2026

**C → WebAssembly (TEMPLATE 7)** · Tác giả: **HTK** · Cập nhật: **09/11/2026**

## Vấn đề

Trong **mùa mưa lũ 2026**, Bình Định chịu lũ sông Kôn dâng cao (Tuy Phước, An Nhơn), bão số 9 và số 10 đổ bộ Quy Nhơn – Phù Cát – Hoài Nhơn, ngập úng đô thị và xói lở bờ biển Nhơn Lý, Cát Tiến. Sau lũ, hàng nghìn giếng khơi/giếng khoan bị **nhiễm phèn** (sắt vượt chuẩn, pH thấp) và **nhiễm mặn** (nước mặn xâm nhập tầng nước ngầm), khiến người dân thiếu nước sạch sinh hoạt.

Dự án giúp bà con tự đánh giá nước giếng qua chỉ số **WQI (0–100)** tính từ pH, độ mặn (‰) và sắt tổng (mg/L), kèm khuyến cáo xử lý nước theo từng mức chất lượng.

## Tính năng

- Hàm C `double calculate_wqi(double ph, double salinity, double iron)` — thuần số học, không stdlib — biên dịch sang **WebAssembly**, chạy ngay trên trình duyệt.
- Bảng **20 điểm test giếng mock** khắp Tuy Phước, An Nhơn, Phù Cát, Quy Nhơn, Hoài Nhơn, Tây Sơn, Vĩnh Thạnh, WQI tính trực tiếp qua WASM + badge màu **Tốt / Trung bình / Kém**.
- Form tự nhập pH / độ mặn / sắt → tính WQI qua WASM → khuyến cáo xử lý (lắng phèn, lọc, RO, Cloramin B…).
- UI tiếng Việt, responsive 375px + 1440px, trang About + 404 có hotline HTK.
- Mock data ghi rõ: **"Dữ liệu mô phỏng – cập nhật 09/11/2026"**.

## Công thức WQI

`WQI = 100 × (0.30 × điểm pH + 0.40 × điểm độ mặn + 0.30 × điểm sắt)` — mỗi chỉ số thành phần chuẩn hóa 0–1: pH tối ưu 6.5–8.5; độ mặn 0‰ = tối đa, ≥ 4‰ = 0; sắt 0 mg/L = tối đa, ≥ 2.5 mg/L = 0. Đánh giá: ≥ 75 Tốt, 50–74 Trung bình, < 50 Kém.

## Công nghệ & cấu trúc

- Ngôn ngữ **C** → `clang --target=wasm32 -nostdlib` → `public/wqi.wasm`
- Frontend: HTML/CSS/JS thuần, `fetch` + `WebAssembly.instantiate`
- Deploy: Vercel static (`outputDirectory: public`, header `Content-Type: application/wasm`)

```
c/wqi.c              # hàm calculate_wqi (C thuần)
public/index.html    # trang chủ: bảng 20 giếng + form WQI
public/about.html    # giới thiệu + block Liên hệ HTK
public/404.html      # 404 + hotline HTK
public/style.css
public/app.js
public/wqi.wasm      # build output (đã commit)
build.ps1            # script build Windows
vercel.json
```

## Cách chạy local

```bash
# Build WASM (Git Bash, clang tại C:/Program Files/LLVM/bin)
export PATH="$PATH:/c/Program Files/LLVM/bin"
clang --target=wasm32 -nostdlib -Wl,--no-entry -Wl,--export-all -O2 -o public/wqi.wasm c/wqi.c

# Hoặc PowerShell:
./build.ps1

# Serve tĩnh
npx serve public
```

## Deploy

Vercel production: **https://binhdinh-water-quality.vercel.app** (xem `deploy_url.txt`).

```bash
vercel --prod --yes
```

## 📞 Liên hệ HTK – 0396241674 – 09/11/2026

- **Tác giả:** HTK
- **Hotline/Zalo:** [0396241674](tel:0396241674) · Zalo: https://zalo.me/0396241674
- **Email:** htk.contact@gmail.com
- **Cập nhật:** 09/11/2026 — mùa mưa lũ 2026 Bình Định

© 2026 HTK · Hotline/Zalo: 0396241674 · Email: htk.contact@gmail.com