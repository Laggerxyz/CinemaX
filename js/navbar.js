/* ============================================================
   NAVBAR.JS – Quản lý trạng thái đăng nhập trên navbar
   Dùng chung cho tất cả các trang
   ============================================================ */

// Chạy ngay khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
  refreshNavAuth();
});

/* Gọi hàm này bất cứ khi nào cần cập nhật trạng thái */
function refreshNavAuth() {
  const wrap = document.getElementById("navAuthWrap");
  if (!wrap) return;
  const user = JSON.parse(localStorage.getItem("cx_user") || "null");
  if (user) {
    renderLoggedIn(wrap, user);
  } else {
    renderLoggedOut(wrap);
  }
}

/* ── Chưa đăng nhập ─────────────────────────────────────── */
function renderLoggedOut(wrap) {
  wrap.innerHTML = `
    <a href="account.html" class="btn-cx-outline"
       style="padding:.45rem 1rem;font-size:.82rem;text-decoration:none;white-space:nowrap">
      <i class="bi bi-person"></i>Đăng Nhập
    </a>`;
}

/* ── Đã đăng nhập ───────────────────────────────────────── */
function renderLoggedIn(wrap, user) {
  const initial   = (user.name || "U").charAt(0).toUpperCase();
  const shortName = user.name
    ? user.name.trim().split(" ").pop()
    : "Tài khoản";

  wrap.innerHTML = `
    <div class="nav-user-dropdown" id="navUserDropdown">
      <button class="nav-user-btn" onclick="toggleNavDropdown(event)" id="navUserBtn">
        <div class="nav-avatar">${initial}</div>
        <span class="nav-username">${shortName}</span>
        <i class="bi bi-chevron-down nav-chevron" id="navChevron"></i>
      </button>
      <div class="nav-dropdown-panel" id="navDropdownPanel">
        <div class="nav-dropdown-header">
          <div class="nav-dropdown-avatar">${initial}</div>
          <div>
            <div class="nav-dropdown-name">${user.name}</div>
            <div class="nav-dropdown-email">${user.email}</div>
          </div>
        </div>
        <div class="nav-dropdown-divider"></div>
        <a href="account.html" class="nav-dropdown-item">
          <i class="bi bi-person-circle"></i>Hồ Sơ & Lịch Sử Vé
        </a>
        <a href="account.html" class="nav-dropdown-item">
          <i class="bi bi-ticket-perforated"></i>Vé Của Tôi
        </a>
        <a href="promotions.html" class="nav-dropdown-item">
          <i class="bi bi-gift"></i>Ưu Đãi Của Tôi
        </a>
        <div class="nav-dropdown-divider"></div>
        <button class="nav-dropdown-item nav-dropdown-logout" onclick="navLogout()">
          <i class="bi bi-box-arrow-right"></i>Đăng Xuất
        </button>
      </div>
    </div>`;

  // Đóng dropdown khi click ra ngoài
  setTimeout(() => {
    document.addEventListener("click", handleOutsideClick);
  }, 10);
}

function handleOutsideClick(e) {
  const panel = document.getElementById("navDropdownPanel");
  const btn   = document.getElementById("navUserBtn");
  if (panel && btn && !panel.contains(e.target) && !btn.contains(e.target)) {
    closeNavDropdown();
  }
}

function toggleNavDropdown(e) {
  e.stopPropagation();
  const panel = document.getElementById("navDropdownPanel");
  const chev  = document.getElementById("navChevron");
  if (!panel) return;
  const isOpen = panel.classList.contains("open");
  if (isOpen) {
    closeNavDropdown();
  } else {
    panel.classList.add("open");
    if (chev) chev.style.transform = "rotate(180deg)";
  }
}

function closeNavDropdown() {
  const panel = document.getElementById("navDropdownPanel");
  const chev  = document.getElementById("navChevron");
  if (panel) panel.classList.remove("open");
  if (chev)  chev.style.transform = "rotate(0deg)";
}

function navLogout() {
  localStorage.removeItem("cx_user");
  closeNavDropdown();
  document.removeEventListener("click", handleOutsideClick);
  const wrap = document.getElementById("navAuthWrap");
  if (wrap) renderLoggedOut(wrap);
  if (typeof showToast === "function") showToast("👋 Đã đăng xuất", "default");
  // Nếu đang ở trang account, reset về form đăng nhập
  if (document.body.dataset.page === "account" || window.location.pathname.includes("account")) {
    const ps = document.getElementById("profileSection");
    const as = document.getElementById("authSection");
    if (ps) ps.style.display = "none";
    if (as) as.style.display = "";
  }
}

// Expose globally
window.refreshNavAuth  = refreshNavAuth;
window.renderLoggedIn  = renderLoggedIn;
window.renderLoggedOut = renderLoggedOut;
window.navLogout       = navLogout;
