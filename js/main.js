/* ============================================================
   MAIN.JS – Trang chủ & dùng chung
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initHeroSlider();
  renderNowShowing();
  renderComingSoon();
  renderCinemas();
  renderPromos();
  initScrollTop();
});

/* ── Navbar scroll effect ── */
function initNavbar() {
  const nav = document.querySelector(".navbar-cinemex");
  window.addEventListener("scroll", () => {
    nav && nav.classList.toggle("scrolled", window.scrollY > 50);
  }, { passive: true });
}

/* ── Hero Slider ── */
function initHeroSlider() {
  const slider = document.getElementById("heroSlider");
  if (!slider) return;
  const featured = MOVIES.filter(m => m.status === "showing").slice(0, 5);
  const track    = slider.querySelector("#heroTrack");
  const dotsWrap = slider.querySelector("#heroDots");
  let current = 0, timer;

  featured.forEach((m, i) => {
    const slide = document.createElement("div");
    slide.className = "hero-slide" + (i === 0 ? " active" : "");
    // Use real image; fallback to gradient
    const bg = m.poster.startsWith("url(")
      ? `background:${m.posterFallback};background-image:${m.poster};background-size:cover;background-position:center top`
      : `background:${m.poster}`;

    slide.innerHTML = `
      <div class="hero-bg" style="${bg};filter:brightness(.48)"></div>
      <div class="hero-overlay"></div>
      <div class="container hero-content">
        <div class="row">
          <div class="col-lg-6 col-md-8">
            <span class="hero-badge"><i class="bi bi-play-circle-fill"></i>Đang chiếu</span>
            <h1 class="hero-title">${m.title}</h1>
            ${m.subtitle ? `<p class="text-white-50 mb-2" style="font-size:.9rem;font-style:italic">${m.subtitle}</p>` : ""}
            <div class="hero-meta">
              <span><i class="bi bi-star-fill text-warning"></i> ${m.score}/10</span>
              <span class="sep">|</span>
              <span>${m.duration} phút</span>
              <span class="sep">|</span>
              <span>${m.rating}</span>
              <span class="sep">|</span>
              <span>${m.genre[0]}</span>
            </div>
            <div class="d-flex gap-2 flex-wrap">
              <a href="booking.html?id=${m.id}" class="btn-cx-primary">
                <i class="bi bi-ticket-perforated-fill"></i>Đặt Vé Ngay
              </a>
              <a href="movie-detail.html?id=${m.id}" class="btn-cx-outline">
                <i class="bi bi-info-circle"></i>Chi Tiết
              </a>
            </div>
          </div>
        </div>
      </div>`;
    track.appendChild(slide);

    const dot = document.createElement("button");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(idx) {
    const slides = track.querySelectorAll(".hero-slide");
    const dots   = dotsWrap.querySelectorAll(".dot");
    slides[current].classList.remove("active");
    dots[current].classList.remove("active");
    current = (idx + featured.length) % featured.length;
    slides[current].classList.add("active");
    dots[current].classList.add("active");
    resetTimer();
  }
  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5000);
  }
  slider.querySelector("#heroPrev").addEventListener("click", () => goTo(current - 1));
  slider.querySelector("#heroNext").addEventListener("click", () => goTo(current + 1));
  resetTimer();
}

/* ── Poster background helper ── */
function posterStyle(m) {
  if (m.poster.startsWith("url(")) {
    return `background:${m.posterFallback};background-image:${m.poster};background-size:cover;background-position:center top`;
  }
  return `background:${m.poster}`;
}

/* ── Now Showing grid ── */
function renderNowShowing() {
  const wrap = document.getElementById("nowShowingGrid");
  if (!wrap) return;
  wrap.innerHTML = MOVIES.filter(m => m.status === "showing").map(m => movieCard(m)).join("");
}

function movieCard(m) {
  return `
    <div class="col-6 col-sm-4 col-lg-3 col-xl-2">
      <div class="movie-card h-100" onclick="location.href='movie-detail.html?id=${m.id}'">
        <div class="movie-poster" style="${posterStyle(m)}">
          <span class="movie-rating-badge">${m.rating}</span>
          <div class="movie-format-badges">
            ${m.format.map(f => `<span class="format-badge">${f}</span>`).join("")}
          </div>
        </div>
        <div class="movie-info">
          <div class="movie-title-card" title="${m.title}">${m.title}</div>
          <div>${m.genre.slice(0,2).map(g=>`<span class="movie-genre-tag">${g}</span>`).join("")}</div>
          <div class="movie-score"><i class="bi bi-star-fill"></i>${m.score}
            <small class="text-muted fw-400" style="font-size:.7rem">(${m.votes.toLocaleString()})</small>
          </div>
        </div>
        <div class="movie-overlay">
          <a href="booking.html?id=${m.id}" class="btn-cx-primary btn-sm">
            <i class="bi bi-ticket-perforated-fill"></i>Đặt Vé
          </a>
          <a href="movie-detail.html?id=${m.id}" class="btn-cx-outline btn-sm">
            <i class="bi bi-info-circle"></i>Chi Tiết
          </a>
        </div>
      </div>
    </div>`;
}

/* ── Coming Soon ── */
function renderComingSoon() {
  const wrap = document.getElementById("comingSoonGrid");
  if (!wrap) return;
  wrap.innerHTML = MOVIES.filter(m => m.status === "coming").map(m => `
    <div class="col-sm-6 col-lg-3">
      <div class="coming-card">
        <div class="coming-poster" style="${posterStyle(m)}">
          <span class="coming-label">Sắp Chiếu</span>
        </div>
        <div class="coming-info">
          <div class="movie-title-card mb-1">${m.title}</div>
          ${m.subtitle ? `<div class="text-muted" style="font-size:.78rem;font-style:italic">${m.subtitle}</div>` : ""}
          <div>${m.genre.slice(0,2).map(g=>`<span class="movie-genre-tag">${g}</span>`).join("")}</div>
          <div class="movie-score mt-2"><i class="bi bi-star-fill"></i>${m.score} dự kiến</div>
          <p class="text-muted mt-2" style="font-size:.78rem;line-height:1.5">${m.synopsis.substring(0,80)}…</p>
          <button class="btn-cx-outline w-100 mt-2 justify-content-center" style="font-size:.8rem"
            onclick="event.stopPropagation();showToast('🔔 Đã đăng ký nhận thông báo cho ${m.title}!','info')">
            <i class="bi bi-bell-fill"></i>Nhận Thông Báo
          </button>
        </div>
      </div>
    </div>`).join("");
}

/* ── Cinemas ── */
function renderCinemas() {
  const wrap = document.getElementById("cinemasGrid");
  if (!wrap) return;
  wrap.innerHTML = CINEMAS.map(c => `
    <div class="col-sm-6 col-lg-3">
      <div class="cinema-card">
        <div class="cinema-icon">🎬</div>
        <div class="cinema-name">${c.name}</div>
        <div class="cinema-address"><i class="bi bi-geo-alt-fill text-danger"></i> ${c.address}, ${c.city}</div>
        <div class="mt-2">${c.facilities.map(f=>`<span class="facility-tag">${f}</span>`).join("")}</div>
        <button class="btn-cx-outline mt-3 w-100 justify-content-center" style="font-size:.78rem"
          onclick="showToast('📍 Mở bản đồ cho ${c.name}','info')">
          <i class="bi bi-map"></i>Xem Bản Đồ
        </button>
      </div>
    </div>`).join("");
}

/* ── Promotions ── */
function renderPromos() {
  const wrap = document.getElementById("promosGrid");
  if (!wrap) return;
  const promos = [
    { tag:"Thẻ Thành Viên", title:"Giảm 20% Mọi Suất Chiếu", bg:"linear-gradient(135deg,#8B0000,#c0392b)", emoji:"🎟️" },
    { tag:"Thứ 3 Vui Vẻ",   title:"Vé Chỉ 55.000đ Mỗi Thứ Ba", bg:"linear-gradient(135deg,#1a3a6c,#3498db)", emoji:"🎉" },
    { tag:"Combo Đôi",       title:"Mua 2 Vé Tặng Bắp Rang Lớn", bg:"linear-gradient(135deg,#4a235a,#8e44ad)", emoji:"🍿" },
    { tag:"Sinh Nhật",       title:"Miễn Phí 1 Vé Trong Tháng Sinh", bg:"linear-gradient(135deg,#7d5a00,#d4a017)", emoji:"🎂" },
  ];
  wrap.innerHTML = promos.map(p => `
    <div class="col-sm-6 col-lg-3">
      <div class="promo-card" onclick="showToast('🎁 Áp dụng ưu đãi: ${p.title}','info')">
        <div class="promo-bg" style="background:${p.bg}"></div>
        <div class="promo-overlay"></div>
        <div class="promo-content">
          <span class="promo-tag">${p.tag}</span>
          <div class="promo-title">${p.emoji} ${p.title}</div>
        </div>
      </div>
    </div>`).join("");
}

/* ── Toast ── */
function showToast(msg, type = "default") {
  let t = document.getElementById("toastCx");
  if (!t) {
    t = document.createElement("div");
    t.id = "toastCx"; t.className = "toast-cx";
    document.body.appendChild(t);
  }
  t.className = `toast-cx ${type}`;
  t.innerHTML = `<i class="bi bi-${type==="success"?"check-circle-fill":type==="info"?"info-circle-fill":"bell-fill"}"></i>${msg}`;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 3000);
}
window.showToast = showToast;

/* ── Scroll to top ── */
function initScrollTop() {
  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return;
  window.addEventListener("scroll", () => btn.classList.toggle("visible", window.scrollY > 400), { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}
