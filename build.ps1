# build.ps1 — Biên dịch C → WebAssembly (chạy từ thư mục gốc project)
# Tác giả: HTK — Hotline/Zalo: 0396241674 — Cập nhật: 09/11/2026
# Nếu clang chưa có trên PATH (Windows): thêm "C:\Program Files\LLVM\bin" vào PATH trước.
$env:Path += ";C:\Program Files\LLVM\bin"
clang --target=wasm32 -nostdlib -Wl,--no-entry -Wl,--export-all -O2 -o public/wqi.wasm c/wqi.c
if ($LASTEXITCODE -eq 0) { Write-Host "Build OK: public/wqi.wasm" } else { exit $LASTEXITCODE }