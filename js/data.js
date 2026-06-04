// ============================================================
// DATA.JS – Dữ liệu phim, rạp, ghế, combo dùng chung toàn site
// ============================================================

const MOVIES = [
  {
    id: 1, title: "Avengers: Secret Wars", subtitle: "",
    genre: ["Hành Động", "Phiêu Lưu", "Viễn Tưởng"],
    duration: 165, rating: "T13", score: 9.2, votes: 24583,
    language: "Phụ đề", director: "Anthony & Joe Russo",
    cast: ["Robert Downey Jr.", "Chris Evans", "Scarlett Johansson", "Benedict Cumberbatch"],
    synopsis: "Khi các vũ trụ song song va chạm, các Avengers phải đối mặt với mối đe dọa lớn nhất từ trước đến nay. Một kẻ thù bí ẩn từ chiều không gian khác đang tìm cách hủy diệt toàn bộ thực tại. Trận chiến cuối cùng để bảo vệ nhân loại bắt đầu.",
    poster: "url('images/avengers.png')",
    banner: "url('images/avengers.png')",
    posterFallback: "linear-gradient(145deg,#8B0000 0%,#c0392b 40%,#1a1a2e 100%)",
    status: "showing", emoji: "⚡", format: ["2D","3D","IMAX"]
  },
  {
    id: 2, title: "Lật Mặt 8", subtitle: "Vòng Tay Nắng",
    genre: ["Hài", "Gia Đình", "Tâm Lý"],
    duration: 128, rating: "T18", score: 8.7, votes: 18920,
    language: "Tiếng Việt", director: "Lý Hải",
    cast: ["Lý Hải", "Minh Hà", "Trương Thế Vinh", "Mạc Văn Khoa"],
    synopsis: "Tiếp nối thành công của loạt phim đình đám, Lật Mặt 8 kể về hành trình của những số phận éo le khi một tờ vé số trúng độc đắc vô tình thay đổi cuộc đời nhiều con người. Tiền bạc có thể mua được hạnh phúc?",
    poster: "url('images/latmat8.png')",
    banner: "url('images/latmat8.png')",
    posterFallback: "linear-gradient(145deg,#b7410e 0%,#f39c12 40%,#6c3483 100%)",
    status: "showing", emoji: "🌅", format: ["2D"]
  },
  {
    id: 3, title: "Dune: Awakening", subtitle: "",
    genre: ["Viễn Tưởng", "Phiêu Lưu", "Sử Thi"],
    duration: 158, rating: "T13", score: 8.9, votes: 15234,
    language: "Phụ đề", director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Zendaya", "Florence Pugh", "Austin Butler"],
    synopsis: "Paul Atreides tiếp tục cuộc hành trình huyền thoại trên hành tinh cát Arrakis. Cuộc chiến giữa các thế lực bóng tối và ánh sáng bùng nổ dữ dội. Số phận cả vũ trụ nằm trong tay một người.",
    poster: "url('images/dune.png')",
    banner: "url('images/dune.png')",
    posterFallback: "linear-gradient(145deg,#7d5a00 0%,#d4a017 40%,#3d2b1f 100%)",
    status: "showing", emoji: "🏜️", format: ["2D","IMAX"]
  },
  {
    id: 4, title: "Quỷ Nhập Tràng", subtitle: "",
    genre: ["Kinh Dị", "Tâm Lý"],
    duration: 112, rating: "T18", score: 8.1, votes: 9876,
    language: "Tiếng Việt", director: "Nguyễn Hữu Tuấn",
    cast: ["Hoàng Yến Chibi", "Diễm My 9X", "Đỗ An", "Hữu Tín"],
    synopsis: "Một ngôi làng bình yên bỗng nhiên bị bao phủ bởi bóng tối kỳ bí. Những linh hồn oan khuất trở về đòi công lý. Cô gái trẻ Linh là người duy nhất có thể nghe thấy tiếng gọi từ bên kia thế giới.",
    poster: "url('images/quynhaptrang.png')",
    banner: "url('images/quynhaptrang.png')",
    posterFallback: "linear-gradient(145deg,#1a0535 0%,#6c2d91 40%,#0d0d0d 100%)",
    status: "showing", emoji: "👻", format: ["2D","3D"]
  },
  {
    id: 5, title: "Mission: Impossible 9", subtitle: "Zero Hour",
    genre: ["Hành Động", "Gián Điệp", "Phiêu Lưu"],
    duration: 172, rating: "T13", score: 9.0, votes: 21453,
    language: "Phụ đề", director: "Christopher McQuarrie",
    cast: ["Tom Cruise", "Hayley Atwell", "Simon Pegg", "Ving Rhames"],
    synopsis: "Ethan Hunt và đội IMF thực hiện nhiệm vụ bất khả thi cuối cùng — ngăn chặn một AI siêu thông minh kiểm soát vũ khí hủy diệt hàng loạt trước khi nó kích hoạt chiến tranh thế giới thứ ba.",
    poster: "url('images/mission9.png')",
    banner: "url('images/mission9.png')",
    posterFallback: "linear-gradient(145deg,#003366 0%,#3498db 40%,#1a1a2e 100%)",
    status: "showing", emoji: "🕵️", format: ["2D","IMAX","Dolby"]
  },
  {
    id: 6, title: "Moana 3", subtitle: "",
    genre: ["Hoạt Hình", "Gia Đình", "Phiêu Lưu"],
    duration: 105, rating: "P", score: 8.5, votes: 12300,
    language: "Lồng tiếng", director: "David Derrick Jr.",
    cast: ["Auli'i Cravalho", "Dwayne Johnson", "Rachel House"],
    synopsis: "Moana trở lại với hành trình vượt đại dương mới, khám phá những vùng đất bí ẩn chưa ai đặt chân tới. Cùng Maui và những người bạn mới, cô đối mặt với thử thách vĩ đại nhất cuộc đời.",
    poster: "url('images/moana3.png')",
    banner: "url('images/moana3.png')",
    posterFallback: "linear-gradient(145deg,#005b96 0%,#00a896 40%,#00688b 100%)",
    status: "showing", emoji: "🌊", format: ["2D","3D"]
  },
  {
    id: 7, title: "The Batman 2", subtitle: "Part II",
    genre: ["Hành Động", "Tội Phạm", "Tâm Lý"],
    duration: 180, rating: "T16", score: 9.1, votes: 8900,
    language: "Phụ đề", director: "Matt Reeves",
    cast: ["Robert Pattinson", "Zoë Kravitz", "Barry Keoghan", "Colman Domingo"],
    synopsis: "Bruce Wayne tiếp tục cuộc chiến chống tội ác trong thành phố Gotham tối tăm. Kẻ thù mới xuất hiện, mạnh hơn, nguy hiểm hơn bao giờ hết. Batman phải đối mặt với bóng tối trong chính tâm hồn mình.",
    poster: "url('images/batman2.png')",
    banner: "url('images/batman2.png')",
    posterFallback: "linear-gradient(145deg,#0a0a1e 0%,#1b3a8c 40%,#0f1e3c 100%)",
    status: "coming", emoji: "🦇", format: ["2D","IMAX"]
  },
  {
    id: 8, title: "Kính Vạn Hoa", subtitle: "Bí Ẩn Ngôi Trường",
    genre: ["Phiêu Lưu", "Gia Đình"],
    duration: 95, rating: "P", score: 8.3, votes: 5420,
    language: "Tiếng Việt", director: "Võ Thanh Hoà",
    cast: ["Thái Hòa", "Ốc Thanh Vân", "Hứa Vĩ Văn"],
    synopsis: "Nhóm bạn nhỏ Mắt Kính tình cờ phát hiện bí mật của ngôi trường 100 năm tuổi. Hành trình khám phá đầy hồi hộp và thú vị chờ đón trong mùa hè đáng nhớ nhất.",
    poster: "url('images/kinhvanhoa.png')",
    banner: "url('images/kinhvanhoa.png')",
    posterFallback: "linear-gradient(145deg,#c0392b 0%,#ff8c94 40%,#ffeaa7 100%)",
    status: "coming", emoji: "🔮", format: ["2D"]
  }
];

const CINEMAS = [
  { id: 1, name: "CinemaX Vincom Center", city: "TP. Hồ Chí Minh", address: "72 Lê Thánh Tôn, Q.1", facilities: ["IMAX","4DX","VIP","Dolby"] },
  { id: 2, name: "CinemaX Aeon Mall Tân Phú", city: "TP. Hồ Chí Minh", address: "30 Bờ Bao Tân Thắng, Tân Phú", facilities: ["3D","Dolby","VIP"] },
  { id: 3, name: "CinemaX Royal City", city: "Hà Nội", address: "72A Nguyễn Trãi, Thanh Xuân", facilities: ["IMAX","4DX","Dolby"] },
  { id: 4, name: "CinemaX Big C Đà Nẵng", city: "Đà Nẵng", address: "255 Hùng Vương, Thanh Khê", facilities: ["3D","Dolby"] }
];

const BASE_SHOWTIMES = ["09:00","10:30","13:00","15:30","17:00","19:30","22:00"];

const TICKET_PRICES = {
  "IMAX":  { normal: 130000, vip: 180000 },
  "4DX":   { normal: 120000, vip: 160000 },
  "Dolby": { normal: 110000, vip: 150000 },
  "3D":    { normal:  95000, vip: 130000 },
  "2D":    { normal:  85000, vip: 120000 }
};

const SNACKS = [
  { id: 1, name: "Bắp Rang Bơ Lớn",             price: 65000, emoji: "🍿" },
  { id: 2, name: "Bắp Rang Bơ Vừa",             price: 50000, emoji: "🍿" },
  { id: 3, name: "Combo Đôi (2 Bắp + 2 Nước)", price: 180000, emoji: "🎬" },
  { id: 4, name: "Coca-Cola Lớn",               price: 45000, emoji: "🥤" },
  { id: 5, name: "Hotdog",                       price: 55000, emoji: "🌭" },
  { id: 6, name: "Khoai Tây Chiên",             price: 45000, emoji: "🍟" }
];

// ── Helpers ──────────────────────────────────────────────────
function getMovieById(id)  { return MOVIES.find(m => m.id === +id); }
function getCinemaById(id) { return CINEMAS.find(c => c.id === +id); }
function formatVND(n)      { return n.toLocaleString("vi-VN") + "đ"; }

function getUrlParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

function getNextDays(n = 7) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
}

function formatDateLabel(d) {
  const days = ["CN","T2","T3","T4","T5","T6","T7"];
  return `${days[d.getDay()]} ${d.getDate()}/${d.getMonth()+1}`;
}

function generateSeats(rows = 9, cols = 14) {
  const taken = new Set();
  const vipRows = new Set([Math.floor(rows/2), Math.floor(rows/2)+1]);
  const count = Math.floor(rows * cols * 0.28);
  while (taken.size < count) taken.add(`${Math.floor(Math.random()*rows)}-${Math.floor(Math.random()*cols)}`);
  return { rows, cols, taken, vipRows };
}

// ── Per-user booking history ──────────────────────────────────
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("cx_user") || "null");
}

function saveBooking(data) {
  // Save "current" booking for payment→confirmation flow
  localStorage.setItem("cx_booking_current", JSON.stringify(data));

  // Also append to per-user history
  const user = getCurrentUser();
  const key  = user ? `cx_history_${user.email}` : "cx_history_guest";
  const list = JSON.parse(localStorage.getItem(key) || "[]");
  // Avoid duplicates by code
  if (data.code && !list.find(b => b.code === data.code)) {
    list.unshift(data); // newest first
  }
  // Keep max 20 entries
  localStorage.setItem(key, JSON.stringify(list.slice(0, 20)));
}

function loadBooking() {
  return JSON.parse(localStorage.getItem("cx_booking_current") || "null");
}

function loadUserHistory() {
  const user = getCurrentUser();
  const key  = user ? `cx_history_${user.email}` : "cx_history_guest";
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function genCode() {
  return "CX" + Date.now().toString(36).toUpperCase().slice(-6);
}
