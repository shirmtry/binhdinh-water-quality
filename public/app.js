/*
 * binhdinh-water-quality — app.js
 * HTK — Hotline/Zalo: 0396241674 — Cập nhật: 09/11/2026
 * Nạp wqi.wasm (C → WebAssembly), tính WQI cho 20 điểm giếng mock + form tự nhập.
 * Dữ liệu mô phỏng – cập nhật 09/11/2026.
 */
"use strict";

// 20 điểm test giếng mô phỏng sau lũ 2026 (nhiễm phèn / nhiễm mặn)
// Dữ liệu mô phỏng – cập nhật 09/11/2026
const WELLS = [
  { name: "Giếng khơi Diêu Trì", area: "Tuy Phước", ph: 5.2, salinity: 1.8, iron: 2.1 },
  { name: "Giếng khoan Phước Sơn", area: "Tuy Phước", ph: 5.8, salinity: 2.5, iron: 1.6 },
  { name: "Giếng khơi Phước Thuận", area: "Tuy Phước", ph: 6.1, salinity: 1.2, iron: 1.2 },
  { name: "Giếng khoan Phước Hòa", area: "Tuy Phước", ph: 6.6, salinity: 0.9, iron: 0.8 },
  { name: "Giếng khơi Bình Định (xã)", area: "An Nhơn", ph: 5.5, salinity: 1.5, iron: 1.9 },
  { name: "Giếng khoan Đập Đá", area: "An Nhơn", ph: 6.3, salinity: 0.8, iron: 0.9 },
  { name: "Giếng khơi Nhơn Thành", area: "An Nhơn", ph: 6.8, salinity: 0.6, iron: 0.5 },
  { name: "Giếng khoan Nhơn Mỹ", area: "An Nhơn", ph: 7.1, salinity: 0.3, iron: 0.3 },
  { name: "Giếng khơi Cát Minh", area: "Phù Cát", ph: 6.4, salinity: 2.2, iron: 0.7 },
  { name: "Giếng khoan Cát Khánh", area: "Phù Cát", ph: 6.9, salinity: 1.6, iron: 0.4 },
  { name: "Giếng khơi Cát Tiến", area: "Phù Cát", ph: 7.0, salinity: 2.8, iron: 0.3 },
  { name: "Giếng khoan Ngô Mây", area: "Phù Cát", ph: 7.2, salinity: 0.2, iron: 0.2 },
  { name: "Giếng khơi Nhơn Lý", area: "Quy Nhơn", ph: 7.0, salinity: 3.2, iron: 0.2 },
  { name: "Giếng khoan Trần Phú", area: "Quy Nhơn", ph: 7.3, salinity: 0.4, iron: 0.3 },
  { name: "Giếng khơi Nhơn Hải", area: "Quy Nhơn", ph: 6.9, salinity: 2.6, iron: 0.5 },
  { name: "Giếng khoan Bùi Thị Xuân", area: "Quy Nhơn", ph: 7.4, salinity: 0.1, iron: 0.1 },
  { name: "Giếng khơi Hoài Hương", area: "Hoài Nhơn", ph: 6.7, salinity: 1.1, iron: 0.6 },
  { name: "Giếng khoan Bồng Sơn", area: "Hoài Nhơn", ph: 7.0, salinity: 0.5, iron: 0.4 },
  { name: "Giếng khơi Phú Phong", area: "Tây Sơn", ph: 6.2, salinity: 0.2, iron: 1.4 },
  { name: "Giếng khoan Vĩnh Thạnh (thị trấn)", area: "Vĩnh Thạnh", ph: 7.1, salinity: 0.1, iron: 0.2 }
];

function classify(wqi) {
  if (wqi >= 75) {
    return {
      label: "Tốt", cls: "badge-good",
      advice: "Nước đạt chất lượng tốt: có thể dùng sinh hoạt, đun sôi trước khi ăn uống. Sau lũ nên thau rửa giếng và kiểm tra định kỳ."
    };
  }
  if (wqi >= 50) {
    return {
      label: "Trung bình", cls: "badge-mid",
      advice: "Nước nhiễm phèn/mặn mức trung bình: lắng bằng phèn chua hoặc PAC, lọc qua bể cát + than hoạt tính, khử trùng Cloramin B và đun sôi trước khi uống. Nếu độ mặn cao, ưu tiên nguồn nước ngọt khác cho ăn uống."
    };
  }
  return {
    label: "Kém", cls: "badge-bad",
    advice: "Nước ô nhiễm nặng (phèn/mặn sau lũ): KHÔNG dùng ăn uống. Nhiễm mặn cần lọc RO hoặc đổi nguồn; nhiễm phèn nặng cần giàn mưa + lọc mangan. Liên hệ HTK 0396241674 để được hỗ trợ nước sạch khẩn cấp."
  };
}

function el(id) { return document.getElementById(id); }

async function init() {
  const status = el("wasm-status");
  let calculateWqi;
  try {
    const res = await fetch("wqi.wasm");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const bytes = await res.arrayBuffer();
    const mod = await WebAssembly.instantiate(bytes);
    calculateWqi = mod.instance.exports.calculate_wqi;
    status.textContent = "✅ Module WebAssembly (C) đã sẵn sàng — hàm calculate_wqi(ph, salinity, iron).";
  } catch (err) {
    status.textContent = "❌ Không nạp được wqi.wasm: " + err.message;
    return;
  }

  // Bảng 20 điểm test
  const tbody = el("well-tbody");
  WELLS.forEach((w, i) => {
    const wqi = calculateWqi(w.ph, w.salinity, w.iron);
    const c = classify(wqi);
    const tr = document.createElement("tr");
    tr.innerHTML =
      "<td>" + (i + 1) + "</td>" +
      "<td>" + w.name + "</td>" +
      "<td>" + w.area + "</td>" +
      "<td>" + w.ph.toFixed(1) + "</td>" +
      "<td>" + w.salinity.toFixed(1) + "</td>" +
      "<td>" + w.iron.toFixed(1) + "</td>" +
      "<td><strong>" + wqi.toFixed(1) + "</strong></td>" +
      '<td><span class="badge ' + c.cls + '">' + c.label + "</span></td>";
    tbody.appendChild(tr);
  });

  // Form tự nhập → tính qua WASM
  el("wqi-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const ph = parseFloat(el("ph").value);
    const sal = parseFloat(el("salinity").value);
    const fe = parseFloat(el("iron").value);
    if (isNaN(ph) || isNaN(sal) || isNaN(fe)) return;
    const wqi = calculateWqi(ph, sal, fe);
    const c = classify(wqi);
    el("result").hidden = false;
    el("result-wqi").textContent = wqi.toFixed(1);
    const badge = el("result-badge");
    badge.textContent = c.label;
    badge.className = "badge " + c.cls;
    el("result-advice").textContent = c.advice;
  });
}

init();