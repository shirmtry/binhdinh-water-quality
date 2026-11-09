/*
 * binhdinh-water-quality — WQI (Water Quality Index) cho nước giếng Bình Định
 * Tác giả: HTK — Hotline/Zalo: 0396241674 — Email: htk.contact@gmail.com
 * Cập nhật: 09/11/2026 — mùa mưa lũ 2026, giếng nhiễm phèn / nhiễm mặn sau lũ.
 *
 * Pure arithmetic, no stdlib. Biên dịch sang WebAssembly bằng clang:
 * clang --target=wasm32 -nostdlib -Wl,--no-entry -Wl,--export-all -O2 -o public/wqi.wasm c/wqi.c
 *
 * Công thức WQI (0–100), trung bình có trọng số 3 chỉ số thành phần:
 *   - pH   (trọng số 0.30): tối ưu 6.5–8.5 (lệch <= 1.0 quanh 7.5 đạt điểm tuyệt đối)
 *   - Độ mặn salinity, đơn vị ‰ (trọng số 0.40): 0‰ = 100 điểm, >= 4‰ = 0 điểm
 *   - Sắt iron, đơn vị mg/L (trọng số 0.30): 0 mg/L = 100 điểm, >= 2.5 mg/L = 0 điểm
 */

static double clamp01(double x) {
    if (x < 0.0) return 0.0;
    if (x > 1.0) return 1.0;
    return x;
}

double calculate_wqi(double ph, double salinity, double iron) {
    double dev = ph - 7.5;
    if (dev < 0.0) dev = -dev;

    double ph_score = clamp01(1.0 - (dev - 1.0) / 2.5);
    double sal_score = clamp01(1.0 - salinity / 4.0);
    double fe_score = clamp01(1.0 - iron / 2.5);

    double wqi = 100.0 * (0.30 * ph_score + 0.40 * sal_score + 0.30 * fe_score);

    if (wqi < 0.0) return 0.0;
    if (wqi > 100.0) return 100.0;
    return wqi;
}