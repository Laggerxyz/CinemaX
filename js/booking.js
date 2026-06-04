/* ============================================================
   BOOKING.JS – Chọn suất chiếu, ghế, combo
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "booking")     initBookingPage();
  if (page === "payment")     initPaymentPage();
  if (page === "confirmation") initConfirmPage();
  if (page === "movies")      initMoviesPage();
  if (page === "detail")      initDetailPage();
});

/* ============================================================
   BOOKING PAGE
   ============================================================ */
function initBookingPage() {
  const movieId = getUrlParam("id");
  const movie   = getMovieById(movieId);
  if (!movie) { location.href = "index.html"; return; }

  // State
  const state = {
    movie,
    cinema:    CINEMAS[0],
    date:      new Date(),
    showtime:  null,
    format:    movie.format[0],
    seats:     [],
    snacks:    {},
    seatMap:   null,
  };
  window.__bk = state; // expose for sidebar updates

  renderBookingHeader(state);
  renderDateSelector(state);
  renderCinemaSelector(state);
  renderShowtimes(state);
  renderSeatSection(state);
  renderSnacks(state);
  updateSidebar(state);
}

function renderBookingHeader(s) {
  const el = document.getElementById("bkMovieHeader");
  if (!el) return;
  // Dùng cùng logic posterStyle để ảnh hiển thị đúng (background-size:cover)
  const thumbStyle = s.movie.poster.startsWith("url(")
    ? `background:${s.movie.posterFallback};background-image:${s.movie.poster};background-size:cover;background-position:center top`
    : `background:${s.movie.poster}`;
  el.innerHTML = `
    <div class="d-flex align-items-center gap-3 flex-wrap">
      <div style="width:54px;height:54px;border-radius:10px;${thumbStyle};flex-shrink:0;overflow:hidden"></div>
      <div>
        <div style="font-family:var(--font-main);font-weight:800;font-size:1.05rem;color:var(--white)">${s.movie.title}</div>
        <div class="d-flex gap-2 flex-wrap mt-1">
          ${s.movie.genre.map(g=>`<span class="movie-genre-tag">${g}</span>`).join("")}
          <span class="movie-genre-tag" style="background:rgba(245,197,24,.15);color:var(--gold)">${s.movie.rating}</span>
        </div>
      </div>
    </div>`;
}

function renderDateSelector(s) {
  const wrap = document.getElementById("dateScroll");
  if (!wrap) return;
  const days = getNextDays(7);
  wrap.innerHTML = days.map((d, i) => {
    const lbl  = formatDateLabel(d);
    const parts = lbl.split(" ");
    return `<button class="date-btn${i===0?" active":""}" data-idx="${i}" onclick="selectDate(${i},this)">
      <span class="day">${parts[0]}</span>
      <span class="date">${parts[1]}</span>
    </button>`;
  }).join("");
  s._days = days;
}

window.selectDate = function(idx, el) {
  document.querySelectorAll(".date-btn").forEach(b => b.classList.remove("active"));
  el.classList.add("active");
  window.__bk.date = window.__bk._days[idx];
  renderShowtimes(window.__bk);
  clearSeats(window.__bk);
};

function renderCinemaSelector(s) {
  const wrap = document.getElementById("cinemaPills");
  if (!wrap) return;
  wrap.innerHTML = CINEMAS.map((c, i) => `
    <button class="cinema-pill${i===0?" active":""}" onclick="selectCinema(${c.id},this)">
      ${c.name}
    </button>`).join("");
}

window.selectCinema = function(id, el) {
  document.querySelectorAll(".cinema-pill").forEach(b => b.classList.remove("active"));
  el.classList.add("active");
  window.__bk.cinema = getCinemaById(id);
  clearSeats(window.__bk);
  updateSidebar(window.__bk);
};

function renderShowtimes(s) {
  const wrap = document.getElementById("showtimeGrid");
  if (!wrap) return;
  s.showtime = null;
  wrap.innerHTML = BASE_SHOWTIMES.map(t => {
    const full = Math.random() > .85;
    const few  = !full && Math.random() > .7;
    return `<button class="showtime-btn${full?" disabled":""}" ${full?"disabled":""} onclick="selectShowtime('${t}',this)">
      ${t}
      <span class="st-format">${few?"⚠ Còn ít ghế":s.movie.format[0]}</span>
    </button>`;
  }).join("");
}

window.selectShowtime = function(t, el) {
  document.querySelectorAll(".showtime-btn").forEach(b => b.classList.remove("active"));
  el.classList.add("active");
  window.__bk.showtime = t;
  clearSeats(window.__bk);
  renderSeatSection(window.__bk, true);
  updateSidebar(window.__bk);
};

/* ── Seat section ── */
function renderSeatSection(s, force = false) {
  const wrap = document.getElementById("seatMapWrap");
  if (!wrap) return;
  if (!s.showtime && !force) {
    wrap.innerHTML = `<div class="text-center text-muted py-5">
      <div style="font-size:2.5rem">🎬</div>
      <div class="mt-2" style="font-family:var(--font-main);font-weight:600">Chọn suất chiếu để xem sơ đồ ghế</div>
    </div>`;
    return;
  }
  s.seatMap = generateSeats(9, 14);
  s.seats   = [];
  buildSeatMap(s, wrap);
  updateSidebar(s);
}

function buildSeatMap(s, wrap) {
  const { rows, cols, taken, vipRows } = s.seatMap;
  const rowLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let html = `<div class="screen-label">
    <div class="screen-bar"></div>
    <div class="screen-text">Màn Hình</div>
  </div>
  <div class="seat-map-outer"><div class="seat-map">`;

  for (let r = 0; r < rows; r++) {
    const isVip = vipRows.has(r);
    html += `<div class="seat-row">
      <span class="row-label">${rowLabels[r]}</span>`;
    for (let c = 0; c < cols; c++) {
      if (c === 7) html += `<div class="seat-aisle"></div>`;
      const key    = `${r}-${c}`;
      const isTaken = taken.has(key);
      const cls    = ["seat", isVip?"vip":"", isTaken?"taken":""].filter(Boolean).join(" ");
      const label  = `${rowLabels[r]}${c+1}`;
      html += `<div class="${cls}" data-key="${key}" data-label="${label}" title="${label}${isVip?" (VIP)":""}"
        onclick="toggleSeat('${key}','${label}',${isVip})"></div>`;
    }
    html += `</div>`;
  }
  html += `</div></div>
  <div class="seat-legend">
    <div class="legend-item"><div class="legend-box legend-normal"></div>Thường</div>
    <div class="legend-item"><div class="legend-box legend-vip"></div>VIP</div>
    <div class="legend-item"><div class="legend-box legend-taken"></div>Đã Đặt</div>
    <div class="legend-item"><div class="legend-box legend-sel"></div>Đang Chọn</div>
  </div>`;
  wrap.innerHTML = html;
}

window.toggleSeat = function(key, label, isVip) {
  const s   = window.__bk;
  const el  = document.querySelector(`[data-key="${key}"]`);
  if (!el || el.classList.contains("taken")) return;

  if (el.classList.contains("selected")) {
    el.classList.remove("selected");
    s.seats = s.seats.filter(x => x.key !== key);
  } else {
    if (s.seats.length >= 8) { showToast("⚠ Tối đa 8 ghế / lần đặt", "default"); return; }
    el.classList.add("selected");
    s.seats.push({ key, label, isVip });
  }
  updateSidebar(s);
};

function clearSeats(s) {
  s.seats = [];
  s.seatMap = null;
  renderSeatSection(s);
}

/* ── Snacks ── */
function renderSnacks(s) {
  const wrap = document.getElementById("snacksWrap");
  if (!wrap) return;
  wrap.innerHTML = SNACKS.map(sn => `
    <div class="snack-item mb-2">
      <div class="d-flex align-items-center">
        <span class="snack-emoji">${sn.emoji}</span>
        <div>
          <div class="snack-name">${sn.name}</div>
          <div class="snack-price">${formatVND(sn.price)}</div>
        </div>
      </div>
      <div class="qty-ctrl">
        <button class="qty-btn" onclick="changeQty(${sn.id},-1)">−</button>
        <span class="qty-num" id="qty_${sn.id}">0</span>
        <button class="qty-btn" onclick="changeQty(${sn.id},1)">+</button>
      </div>
    </div>`).join("");
}

window.changeQty = function(id, delta) {
  const s  = window.__bk;
  const cur = s.snacks[id] || 0;
  const nv  = Math.max(0, Math.min(5, cur + delta));
  if (nv === 0) delete s.snacks[id]; else s.snacks[id] = nv;
  document.getElementById(`qty_${id}`).textContent = nv;
  updateSidebar(s);
};

/* ── Sidebar ── */
function updateSidebar(s) {
  const formatKey   = s.format || (s.movie.format[0]);
  const prices      = TICKET_PRICES[formatKey] || TICKET_PRICES["2D"];
  let ticketTotal   = 0;
  let snackTotal    = 0;

  s.seats.forEach(seat => { ticketTotal += seat.isVip ? prices.vip : prices.normal; });
  Object.entries(s.snacks).forEach(([id, qty]) => {
    const sn = SNACKS.find(x => x.id === +id);
    if (sn) snackTotal += sn.price * qty;
  });

  const total = ticketTotal + snackTotal;
  s._total    = total;

  // Seat chips
  const chipsEl = document.getElementById("seatChips");
  if (chipsEl) chipsEl.innerHTML = s.seats.length
    ? s.seats.map(seat => `<span class="seat-chip">${seat.label}${seat.isVip?" ⭐":""}</span>`).join("")
    : `<span class="text-muted" style="font-size:.8rem">Chưa chọn ghế</span>`;

  setEl("sbCinema",   s.cinema?.name || "—");
  setEl("sbDate",     s.date ? formatDateLabel(s.date) : "—");
  setEl("sbShowtime", s.showtime || "—");
  setEl("sbFormat",   formatKey);
  setEl("sbTicketCount", s.seats.length ? `${s.seats.length} ghế` : "—");
  setEl("sbTicketPrice", ticketTotal ? formatVND(ticketTotal) : "—");
  setEl("sbSnackPrice",  snackTotal  ? formatVND(snackTotal)  : "—");
  setEl("sbTotal",    formatVND(total));

  const btn = document.getElementById("btnContinue");
  if (btn) {
    const ok = s.seats.length > 0 && s.showtime;
    btn.disabled  = !ok;
    btn.style.opacity = ok ? "1" : ".5";
  }
}

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

window.proceedToPayment = function() {
  const s = window.__bk;
  if (!s.seats.length || !s.showtime) return;
  saveBooking({
    movieId:    s.movie.id,
    movieTitle: s.movie.title,
    movieEmoji: s.movie.emoji,
    moviePoster: s.movie.posterFallback,
    cinemaName: s.cinema.name,
    cinemaAddr: s.cinema.address,
    date:       formatDateLabel(s.date),
    showtime:   s.showtime,
    format:     s.format || s.movie.format[0],
    seats:      s.seats,
    snacks:     s.snacks,
    total:      s._total,
    code:       genCode(),
  });
  location.href = "payment.html";
};

/* ============================================================
   PAYMENT PAGE
   ============================================================ */
function initPaymentPage() {
  const bk = loadBooking();
  if (!bk) { location.href = "index.html"; return; }
  window.__bkPay = bk; // expose để applyPromo cập nhật cùng object

  renderOrderSummary(bk);
  initPayMethods();
  initPayForm(bk);
}

function renderOrderSummary(bk) {
  const el = document.getElementById("orderSummary");
  if (!el) return;

  const snackLines = Object.entries(bk.snacks || {}).map(([id, qty]) => {
    const sn = SNACKS.find(x => x.id === +id);
    return sn ? `<div class="summary-row"><span class="text-muted">${sn.emoji} ${sn.name} x${qty}</span><span class="sr-val">${formatVND(sn.price * qty)}</span></div>` : "";
  }).join("");

  // Hiện dòng giảm giá nếu đã áp mã
  const discountLine = bk.discountAmount
    ? `<div class="summary-row">
         <span style="color:#2ecc71"><i class="bi bi-tag-fill me-1"></i>Mã ${bk.discountCode}</span>
         <span class="sr-val" style="color:#2ecc71">-${formatVND(bk.discountAmount)}</span>
       </div>`
    : "";

  el.innerHTML = `
    <div class="summary-title"><i class="bi bi-receipt text-danger"></i> Thông Tin Đặt Vé</div>
    <div class="summary-row"><span>Phim</span><span class="sr-val fw-700">${bk.movieTitle}</span></div>
    <div class="summary-row"><span>Rạp</span><span class="sr-val">${bk.cinemaName}</span></div>
    <div class="summary-row"><span>Ngày</span><span class="sr-val">${bk.date}</span></div>
    <div class="summary-row"><span>Suất</span><span class="sr-val">${bk.showtime} · ${bk.format}</span></div>
    <div class="summary-row"><span>Ghế</span><span class="sr-val">${bk.seats.map(s=>s.label).join(", ")}</span></div>
    <hr class="sidebar-divider">
    ${snackLines || ""}
    ${discountLine}
    <hr class="sidebar-divider">
    <div class="summary-total"><span>Tổng Cộng</span><span>${formatVND(bk.total)}</span></div>`;
}

function initPayMethods() {
  const methods = [
    { id:"momo",  icon:"💜", name:"MoMo" },
    { id:"vnpay", icon:"🔵", name:"VNPay" },
    { id:"zalo",  icon:"💙", name:"ZaloPay" },
    { id:"card",  icon:"💳", name:"Thẻ ATM" },
    { id:"visa",  icon:"🌐", name:"Visa/MC" },
    { id:"cash",  icon:"💵", name:"Tiền Mặt" },
  ];
  const wrap = document.getElementById("payMethodsWrap");
  if (!wrap) return;
  wrap.innerHTML = methods.map(m => `
    <div class="pay-method" data-method="${m.id}" onclick="selectMethod('${m.id}',this)">
      <span class="pay-icon">${m.icon}</span>
      <div class="pay-name">${m.name}</div>
    </div>`).join("");
}

window.selectMethod = function(id, el) {
  document.querySelectorAll(".pay-method").forEach(b => b.classList.remove("selected"));
  el.classList.add("selected");
  window.__payMethod = id;
  const cardFields = document.getElementById("cardFields");
  if (cardFields) cardFields.style.display = ["card","visa"].includes(id) ? "block" : "none";
};

function initPayForm(bk) {
  const btn = document.getElementById("btnPay");
  if (!btn) return;
  btn.textContent = `Thanh Toán ${formatVND(bk.total)}`;
  btn.addEventListener("click", () => {
    const name  = document.getElementById("payerName")?.value.trim();
    const phone = document.getElementById("payerPhone")?.value.trim();
    const email = document.getElementById("payerEmail")?.value.trim();
    if (!name || !phone || !email) { showToast("⚠ Vui lòng điền đầy đủ thông tin", "default"); return; }
    if (!window.__payMethod) { showToast("⚠ Chọn phương thức thanh toán", "default"); return; }
    bk.customerName  = name;
    bk.customerPhone = phone;
    bk.customerEmail = email;
    bk.payMethod     = window.__payMethod;
    bk.status        = 'Đã Thanh Toán';
    // code already set in proceedToPayment, keep it
    if (!bk.code) bk.code = genCode();
    saveBooking(bk); // saves to cx_booking_current AND appends to user history
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Đang xử lý…`;
    setTimeout(() => location.href = "confirmation.html", 1800);
  });
}

/* ============================================================
   CONFIRMATION PAGE
   ============================================================ */
function initConfirmPage() {
  const bk = loadBooking();
  if (!bk) { location.href = "index.html"; return; }
  renderConfirmation(bk);
}

function renderConfirmation(bk) {
  const el = document.getElementById("confirmContent");
  if (!el) return;
  const payIcons = { momo:"💜",vnpay:"🔵",zalo:"💙",card:"💳",visa:"🌐",cash:"💵" };
  const snackLines = Object.entries(bk.snacks || {}).map(([id, qty]) => {
    const sn = SNACKS.find(x => x.id === +id);
    return sn ? `<div class="ticket-detail-row"><span class="td-label">${sn.emoji} ${sn.name}</span><span class="td-val">x${qty} – ${formatVND(sn.price*qty)}</span></div>` : "";
  }).join("");

  el.innerHTML = `
    <div class="confirm-success-icon">✓</div>
    <div class="text-center mb-3">
      <div style="font-family:var(--font-main);font-size:1.3rem;font-weight:800;color:var(--white)">Đặt Vé Thành Công!</div>
      <div class="text-muted" style="font-size:.85rem">Vé sẽ được gửi tới email của bạn</div>
    </div>
    <div class="ticket-code">${bk.code}</div>
    <div class="ticket-detail-row"><span class="td-label">Khách Hàng</span><span class="td-val">${bk.customerName}</span></div>
    <div class="ticket-detail-row"><span class="td-label">Điện Thoại</span><span class="td-val">${bk.customerPhone}</span></div>
    <div class="ticket-detail-row"><span class="td-label">Email</span><span class="td-val">${bk.customerEmail}</span></div>
    <div class="ticket-detail-row"><span class="td-label">Phim</span><span class="td-val fw-700">${bk.movieTitle}</span></div>
    <div class="ticket-detail-row"><span class="td-label">Rạp</span><span class="td-val">${bk.cinemaName}</span></div>
    <div class="ticket-detail-row"><span class="td-label">Địa Chỉ</span><span class="td-val">${bk.cinemaAddr}</span></div>
    <div class="ticket-detail-row"><span class="td-label">Ngày Chiếu</span><span class="td-val">${bk.date}</span></div>
    <div class="ticket-detail-row"><span class="td-label">Suất Chiếu</span><span class="td-val">${bk.showtime} · ${bk.format}</span></div>
    <div class="ticket-detail-row"><span class="td-label">Ghế</span><span class="td-val">${bk.seats.map(s=>s.label).join(", ")}</span></div>
    ${snackLines}
    <div class="ticket-detail-row"><span class="td-label">Thanh Toán</span><span class="td-val">${payIcons[bk.payMethod]||""} ${bk.payMethod?.toUpperCase()}</span></div>
    <div class="ticket-detail-row" style="border-top:2px solid rgba(229,9,20,.3);margin-top:.5rem;padding-top:.75rem">
      <span class="td-label fw-700" style="color:var(--white)">Tổng Tiền</span>
      <span class="td-val" style="color:var(--red);font-size:1.1rem">${formatVND(bk.total)}</span>
    </div>`;
}

/* ============================================================
   MOVIES LIST PAGE
   ============================================================ */
function initMoviesPage() {
  const wrap   = document.getElementById("moviesListGrid");
  const search = document.getElementById("movieSearch");
  const filters = document.querySelectorAll("[data-genre]");
  if (!wrap) return;

  let active = "all";

  function render(query = "") {
    const q = query.toLowerCase();
    const filtered = MOVIES.filter(m => {
      const matchQ = !q || m.title.toLowerCase().includes(q) || m.genre.some(g=>g.toLowerCase().includes(q));
      const matchG = active==="all" || m.genre.includes(active) || (active==="showing"&&m.status==="showing") || (active==="coming"&&m.status==="coming");
      return matchQ && matchG;
    });
    wrap.innerHTML = filtered.length
      ? filtered.map(m => movieCardFull(m)).join("")
      : `<div class="col-12 text-center py-5 text-muted"><div style="font-size:2rem">🔍</div><div class="mt-2">Không tìm thấy phim phù hợp</div></div>`;
  }

  render();
  search?.addEventListener("input", e => render(e.target.value));
  filters.forEach(btn => btn.addEventListener("click", () => {
    filters.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    active = btn.dataset.genre;
    render(search?.value||"");
  }));
}

function movieCardFull(m) {
  return `
    <div class="col-6 col-sm-4 col-md-3 col-xl-2">
      <div class="movie-card h-100" onclick="location.href='movie-detail.html?id=${m.id}'">
        <div class="movie-poster" style="${m.poster.startsWith('url(') ? `background:${m.posterFallback};background-image:${m.poster};background-size:cover;background-position:center top` : `background:${m.poster}`}">
          <span style="font-size:3.5rem">${m.emoji}</span>
          <span class="movie-rating-badge">${m.rating}</span>
          ${m.status==="coming"?`<div style="position:absolute;top:.6rem;left:.6rem;background:var(--gold);color:var(--dark);font-size:.6rem;font-weight:800;padding:.15rem .4rem;border-radius:4px;font-family:var(--font-main)">Sắp chiếu</div>`:""}
          <div class="movie-format-badges">${m.format.map(f=>`<span class="format-badge">${f}</span>`).join("")}</div>
        </div>
        <div class="movie-info">
          <div class="movie-title-card">${m.title}</div>
          <div>${m.genre.slice(0,2).map(g=>`<span class="movie-genre-tag">${g}</span>`).join("")}</div>
          <div class="movie-score mt-1"><i class="bi bi-star-fill"></i>${m.score}</div>
        </div>
        <div class="movie-overlay">
          ${m.status==="showing"
            ? `<a href="booking.html?id=${m.id}" class="btn-cx-primary btn-sm"><i class="bi bi-ticket-perforated-fill"></i>Đặt Vé</a>`
            : `<button class="btn-cx-gold btn-sm" onclick="event.stopPropagation();showToast('🔔 Đã đặt nhận thông báo!','info')"><i class="bi bi-bell-fill"></i>Nhận Thông Báo</button>`}
          <a href="movie-detail.html?id=${m.id}" class="btn-cx-outline btn-sm"><i class="bi bi-info-circle"></i>Chi Tiết</a>
        </div>
      </div>
    </div>`;
}

/* ============================================================
   MOVIE DETAIL PAGE
   ============================================================ */
function initDetailPage() {
  const movieId = getUrlParam("id");
  const movie   = getMovieById(movieId);
  if (!movie) { location.href = "movies.html"; return; }

  // Hero
  const hero = document.getElementById("detailHero");
  if (hero) {
    if (movie.poster.startsWith("url(")) {
      hero.style.backgroundImage = movie.poster;
      hero.style.backgroundSize = "cover";
      hero.style.backgroundPosition = "center center";
      hero.style.filter = "none";
    } else {
      hero.style.background = movie.banner;
    }
    const emojiEl = document.getElementById("dHeroEmoji");
    if (movie.poster.startsWith("url(")) {
      emojiEl.style.backgroundImage = movie.poster;
      emojiEl.style.backgroundSize = "cover";
      emojiEl.style.backgroundPosition = "center top";
      emojiEl.textContent = "";
    } else {
      emojiEl.textContent = movie.emoji;
    }
    document.getElementById("dTitle").textContent      = movie.title;
    document.getElementById("dSubtitle").textContent   = movie.subtitle || "";
    document.getElementById("dScore").innerHTML        = `<i class="bi bi-star-fill text-warning"></i> ${movie.score}/10 <small class="text-muted">(${movie.votes.toLocaleString()} đánh giá)</small>`;
    document.getElementById("dDuration").textContent   = `${movie.duration} phút`;
    document.getElementById("dRating").textContent     = movie.rating;
    document.getElementById("dLanguage").textContent   = movie.language;
    document.getElementById("dGenres").innerHTML       = movie.genre.map(g=>`<span class="movie-genre-tag">${g}</span>`).join("");
    document.getElementById("dFormats").innerHTML      = movie.format.map(f=>`<span class="format-badge">${f}</span>`).join("");
    document.getElementById("dBookBtn").href           = `booking.html?id=${movie.id}`;
    if (movie.status === "coming") {
      document.getElementById("dBookBtn").outerHTML = `<button class="btn-cx-gold" onclick="showToast('🔔 Đã đăng ký nhận thông báo!','info')"><i class="bi bi-bell-fill"></i>Nhận Thông Báo</button>`;
    }
  }

  // Synopsis
  setEl("dSynopsis",  movie.synopsis);
  setEl("dDirector",  movie.director);
  setEl("dCast",      movie.cast.join(" · "));

  // Similar
  const simWrap = document.getElementById("similarMovies");
  if (simWrap) {
    const sim = MOVIES.filter(m => m.id !== movie.id && m.genre.some(g=>movie.genre.includes(g))).slice(0,4);
    simWrap.innerHTML = sim.map(m => `
      <div class="col-6 col-sm-3">
        <div class="movie-card" onclick="location.href='movie-detail.html?id=${m.id}'">
          <div class="movie-poster" style="${m.poster.startsWith('url(') ? `background:${m.posterFallback};background-image:${m.poster};background-size:cover;background-position:center top` : `background:${m.poster}`};height:160px">
            <span style="font-size:2.5rem">${m.emoji}</span>
            <span class="movie-rating-badge">${m.rating}</span>
          </div>
          <div class="movie-info">
            <div class="movie-title-card">${m.title}</div>
            <div class="movie-score"><i class="bi bi-star-fill"></i>${m.score}</div>
          </div>
        </div>
      </div>`).join("");
  }

  // Tabs
  document.querySelectorAll(".detail-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".detail-tab,.tab-pane").forEach(x=>x.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.target)?.classList.add("active");
    });
  });
}
