/* ═══════════════════════════════════════════════════════════════
   KisanBazaar – app.js
   Pure vanilla JS, no build tools needed.
═══════════════════════════════════════════════════════════════ */

/* ── CONSTANTS ─────────────────────────────────────────────── */
const CROP_CALENDAR = {
  January: ["Radish", "Carrot", "Spinach", "Mustard"],
  February: ["Onion", "Potato", "Garlic", "Peas"],
  March: ["Tomato", "Eggplant", "Capsicum", "Okra"],
  April: ["Cucumber", "Bitter Gourd", "Bottle Gourd", "Watermelon"],
  May: ["Mango", "Jackfruit", "Lychee", "Jamun"],
  June: ["Maize", "Soybean", "Groundnut", "Sesame"],
  July: ["Paddy", "Cotton", "Sugarcane", "Ginger"],
  August: ["Paddy", "Turmeric", "Cardamom", "Black Pepper"],
  September: ["Green Chilli", "Coriander", "Fenugreek", "Dill"],
  October: ["Wheat (sowing)", "Chickpea", "Mustard (sowing)", "Lentil"],
  November: ["Wheat", "Potato (sowing)", "Peas", "Cauliflower"],
  December: ["Strawberry", "Carrot", "Beetroot", "Turnip"],
};
const MONTHS = Object.keys(CROP_CALENDAR);
const currentMonthIndex = new Date().getMonth();
const currentMonth = MONTHS[currentMonthIndex];

const MOCK_FARMERS = [
  {
    id: "f1",
    name: "Ramesh Yadav",
    location: "Sikar, Rajasthan",
    avatar: "RY",
    bio: "Third generation wheat & mustard farmer. 12 acres of organic farmland in the Shekhawati belt.",
    rating: 4.8,
    reviews: 142,
    verified: true,
    produces: [
      {
        id: "p1",
        name: "Organic Wheat",
        price: 28,
        unit: "kg",
        qty: 500,
        season: [
          "October",
          "November",
          "December",
          "January",
          "February",
          "March",
        ],
        tag: "Organic",
        img: "🌾",
      },
      {
        id: "p2",
        name: "Mustard Oil (cold-pressed)",
        price: 180,
        unit: "litre",
        qty: 80,
        season: ["February", "March", "April"],
        tag: "Cold Pressed",
        img: "🫒",
      },
      {
        id: "p3",
        name: "Desi Garlic",
        price: 120,
        unit: "kg",
        qty: 60,
        season: ["January", "February", "March"],
        tag: "Pesticide Free",
        img: "🧄",
      },
    ],
  },
  {
    id: "f2",
    name: "Sunita Meena",
    location: "Dausa, Rajasthan",
    avatar: "SM",
    bio: "Vegetable farming since 2005. Specialising in seasonal produce and leafy greens.",
    rating: 4.9,
    reviews: 89,
    verified: true,
    produces: [
      {
        id: "p4",
        name: "Fresh Tomatoes",
        price: 35,
        unit: "kg",
        qty: 200,
        season: ["March", "April", "May", "June"],
        tag: "Fresh",
        img: "🍅",
      },
      {
        id: "p5",
        name: "Spinach Bunch",
        price: 15,
        unit: "bunch",
        qty: 150,
        season: ["November", "December", "January", "February", "March"],
        tag: "Organic",
        img: "🥬",
      },
      {
        id: "p6",
        name: "Radish",
        price: 20,
        unit: "kg",
        qty: 100,
        season: ["December", "January", "February"],
        tag: "Fresh",
        img: "🫚",
      },
    ],
  },
  {
    id: "f3",
    name: "Bharat Singh",
    location: "Alwar, Rajasthan",
    avatar: "BS",
    bio: "Mango orchards spanning 8 acres. Desi Langra & Dasheri varieties grown traditionally.",
    rating: 4.7,
    reviews: 203,
    verified: false,
    produces: [
      {
        id: "p7",
        name: "Langra Mango",
        price: 85,
        unit: "kg",
        qty: 300,
        season: ["May", "June", "July"],
        tag: "Desi Variety",
        img: "🥭",
      },
      {
        id: "p8",
        name: "Dasheri Mango",
        price: 95,
        unit: "kg",
        qty: 250,
        season: ["June", "July"],
        tag: "Premium",
        img: "🥭",
      },
      {
        id: "p9",
        name: "Raw Mango (Kaccha)",
        price: 30,
        unit: "kg",
        qty: 100,
        season: ["April", "May"],
        tag: "Pickle Grade",
        img: "🥭",
      },
    ],
  },
  {
    id: "f4",
    name: "Kavita Sharma",
    location: "Jhunjhunu, Rajasthan",
    avatar: "KS",
    bio: "Spice and herb cultivation. Producing authentic Rajasthani red chilli, coriander and cumin.",
    rating: 4.6,
    reviews: 67,
    verified: true,
    produces: [
      {
        id: "p10",
        name: "Mathania Red Chilli",
        price: 350,
        unit: "kg",
        qty: 40,
        season: ["September", "October", "November", "December"],
        tag: "GI Tagged",
        img: "🌶️",
      },
      {
        id: "p11",
        name: "Cumin Seeds",
        price: 280,
        unit: "kg",
        qty: 30,
        season: ["March", "April"],
        tag: "Authentic",
        img: "🌿",
      },
      {
        id: "p12",
        name: "Coriander Powder",
        price: 120,
        unit: "kg",
        qty: 50,
        season: ["February", "March"],
        tag: "Ground Fresh",
        img: "🌿",
      },
    ],
  },
];

/* ── STATE ─────────────────────────────────────────────────── */
let farmers = loadStorage("farmapp:farmers", MOCK_FARMERS);
let orders = loadStorage("farmapp:orders", []);
let selectedCalMonth = currentMonth;
let aiMessages = [
  {
    role: "assistant",
    content:
      "👋 Namaste! I'm your KisanAI assistant. Ask me anything — best crops for this season, price estimates, farming tips, or help finding a farmer near you!",
  },
];
let aiLoading = false;

/* ── STORAGE HELPERS ───────────────────────────────────────── */
function loadStorage(key, def) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : def;
  } catch {
    return def;
  }
}
function saveStorage(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

/* ── DERIVED DATA ──────────────────────────────────────────── */
function getAllProduce() {
  return farmers.flatMap((f) =>
    f.produces.map((p) => ({
      ...p,
      farmerName: f.name,
      farmerId: f.id,
      farmerLocation: f.location,
    })),
  );
}

/* ── HELPER: HTML ──────────────────────────────────────────── */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function avatar(initials, size = 40, color = "#4A7C28") {
  return `<div class="avatar" style="width:${size}px;height:${size}px;font-size:${size * 0.35}px;background:${color}">${initials}</div>`;
}

function stars(rating) {
  const full = Math.round(rating);
  return `<span class="stars">${"★".repeat(full)}${"☆".repeat(5 - full)}<span>${rating}</span></span>`;
}

function badge(text, cls = "badge-sage") {
  return `<span class="badge ${cls}">${text}</span>`;
}

function tagColor(tag) {
  const map = {
    Organic: "badge-success",
    "GI Tagged": "badge-terra",
    Premium: "badge-terra",
    "Cold Pressed": "badge-gold",
    Authentic: "badge-gold",
    "Pesticide Free": "badge-success",
    Fresh: "badge-sage",
    "Desi Variety": "badge-sage",
    "Ground Fresh": "badge-sage",
    "Pickle Grade": "badge-sage",
  };
  return map[tag] || "badge-sage";
}

/* ── TOAST ─────────────────────────────────────────────────── */
let toastTimer;
function showToast(msg, type = "") {
  const el = $("#toast");
  el.textContent = msg;
  el.className = "toast" + (type === "error" ? " error" : "");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add("hidden"), 3200);
}

/* ── MODAL HELPERS ─────────────────────────────────────────── */
function openModal(id) {
  $(`#${id}`).classList.remove("hidden");
}
function closeModal(id) {
  $(`#${id}`).classList.add("hidden");
}

/* ── TABS ──────────────────────────────────────────────────── */
function switchTab(tab) {
  $$(".tab-btn").forEach((b) =>
    b.classList.toggle("active", b.dataset.tab === tab),
  );
  $$(".tab-pane").forEach((p) =>
    p.classList.toggle("active", p.id === `tab-${tab}`),
  );
  if (tab === "market") renderMarket();
  if (tab === "farmers") renderFarmers();
  if (tab === "calendar") renderCalendar();
  if (tab === "orders") renderOrders();
}

/* ══════════════════════════════════════════════════════════════
   RENDER: MARKET TAB
══════════════════════════════════════════════════════════════ */
function renderMarket() {
  const allProduce = getAllProduce();
  const search = $("#search-input").value.toLowerCase();
  const fSeason = $("#season-filter").value;
  const fLoc = $("#loc-filter").value.toLowerCase();
  const inSeason = allProduce.filter((p) => p.season.includes(currentMonth));

  // Hero stats
  $("#hero-sub-text").textContent =
    `No middlemen. Fair prices. ${inSeason.length} items in season this month.`;
  $("#hero-stats").innerHTML = [
    ["🌾", farmers.length, "Farmers"],
    ["🥦", allProduce.length, "Products"],
    ["🛒", orders.length, "Orders"],
  ]
    .map(
      ([icon, val, lbl]) =>
        `<div class="hero-stat"><div class="hero-stat-icon">${icon}</div><div class="hero-stat-val">${val}</div><div class="hero-stat-lbl">${lbl}</div></div>`,
    )
    .join("");

  // In-season badge
  $("#in-season-badge").textContent = currentMonth;
  const inSeasonSec = $("#in-season-section");
  inSeasonSec.style.display = fSeason === "All" ? "" : "none";

  // In-season strip
  if (fSeason === "All") {
    $("#in-season-strip").innerHTML = inSeason
      .slice(0, 6)
      .map((p) => {
        const farmer = farmers.find((f) => f.id === p.farmerId);
        return `<div class="season-chip" data-pid="${p.id}" data-fid="${p.farmerId}">
        <span class="season-chip-emoji">${p.img}</span>
        <div class="season-chip-name">${p.name}</div>
        <div class="season-chip-price">₹${p.price}/${p.unit}</div>
        ${badge(p.tag, tagColor(p.tag))}
      </div>`;
      })
      .join("");

    $$(".season-chip").forEach((el) => {
      el.addEventListener("click", () => {
        const p = getAllProduce().find((x) => x.id === el.dataset.pid);
        const f = farmers.find((x) => x.id === el.dataset.fid);
        openOrderModal(p, f);
      });
    });
  }

  // Filtered produce
  const filtered = allProduce.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search) ||
      p.farmerName.toLowerCase().includes(search) ||
      p.tag.toLowerCase().includes(search);
    const matchSeason = fSeason === "All" || p.season.includes(fSeason);
    const matchLoc = !fLoc || p.farmerLocation.toLowerCase().includes(fLoc);
    return matchSearch && matchSeason && matchLoc;
  });

  // Heading
  const heading =
    fSeason !== "All" ? `${fSeason} Produce` : "All Available Produce";
  $("#produce-heading").innerHTML =
    `${heading} <span style="font-family:'DM Sans',sans-serif;font-size:14px;color:#6B6B6B;font-weight:400;margin-left:10px">(${filtered.length} items)</span>`;

  // Grid
  if (filtered.length === 0) {
    $("#produce-grid").innerHTML = `<div class="card" style="grid-column:1/-1">
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <div class="empty-title">No produce found</div>
        <div class="empty-sub">Try different search terms or filters.</div>
      </div></div>`;
  } else {
    $("#produce-grid").innerHTML = filtered
      .map(
        (p) => `
      <div class="card card-clickable produce-card" data-pid="${p.id}" data-fid="${p.farmerId}">
        <div class="produce-card-top">
          <span class="produce-card-emoji">${p.img}</span>
          ${badge(p.tag, tagColor(p.tag))}
        </div>
        <div class="produce-card-name">${p.name}</div>
        <div class="produce-card-farmer">by ${p.farmerName} · 📍 ${p.farmerLocation}</div>
        <div class="produce-card-bottom">
          <div>
            <span class="produce-card-price">₹${p.price}</span>
            <span class="produce-card-unit">/${p.unit}</span>
          </div>
          <span class="produce-card-qty">Qty: ${p.qty}</span>
        </div>
        <div class="produce-card-cta">
          <button class="btn btn-primary btn-full">Order Now</button>
        </div>
      </div>`,
      )
      .join("");

    $$(".produce-card").forEach((el) => {
      el.addEventListener("click", () => {
        const p = getAllProduce().find((x) => x.id === el.dataset.pid);
        const f = farmers.find((x) => x.id === el.dataset.fid);
        openOrderModal(p, f);
      });
    });
  }
}

/* ══════════════════════════════════════════════════════════════
   RENDER: FARMERS TAB
══════════════════════════════════════════════════════════════ */
function renderFarmers() {
  $("#farmers-grid").innerHTML = farmers
    .map(
      (f) => `
    <div class="card card-clickable farmer-card" data-fid="${f.id}">
      <div class="farmer-header">
        ${avatar(f.avatar, 48, "#4A7C28")}
        <div>
          <div class="farmer-name-row">
            <span class="farmer-name">${f.name}</span>
            ${f.verified ? badge("✓", "badge-success") : ""}
          </div>
          <div class="farmer-loc">📍 ${f.location}</div>
          ${stars(f.rating)}
        </div>
      </div>
      <p class="farmer-bio">${f.bio.slice(0, 90)}…</p>
      <div class="farmer-pills">
        ${f.produces
          .slice(0, 3)
          .map((p) => `<span class="farmer-pill">${p.img} ${p.name}</span>`)
          .join("")}
      </div>
      <button class="btn btn-outline btn-full">View Profile &amp; Order</button>
    </div>`,
    )
    .join("");

  $$(".farmer-card").forEach((el) => {
    el.addEventListener("click", () => {
      const f = farmers.find((x) => x.id === el.dataset.fid);
      openProfileModal(f);
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   RENDER: CALENDAR TAB
══════════════════════════════════════════════════════════════ */
function renderCalendar() {
  $("#cal-current-month").textContent = currentMonth;

  // Month pills
  $("#month-pills").innerHTML = MONTHS.map(
    (m) =>
      `<button class="month-pill${m === selectedCalMonth ? " active" : ""}" data-month="${m}">${m}${m === currentMonth ? " 🌱" : ""}</button>`,
  ).join("");
  $$(".month-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedCalMonth = btn.dataset.month;
      renderCalendar();
    });
  });

  // Hero card
  $("#cal-hero").innerHTML = `
    <h3 class="cal-hero-title">🌿 ${selectedCalMonth} Harvest</h3>
    <div class="cal-chips">
      ${CROP_CALENDAR[selectedCalMonth].map((c) => `<div class="cal-chip">${c}</div>`).join("")}
    </div>`;

  // Full grid
  $("#cal-grid").innerHTML = MONTHS.map(
    (m) => `
    <div class="card cal-month-card${m === currentMonth ? " " : " "}" style="${m === currentMonth ? "border-left:4px solid #2D5016" : ""};background:${m === selectedCalMonth ? "#f5f0e8" : "#fff"}" data-month="${m}">
      <div class="cal-month-name">${m}</div>
      <div class="cal-month-crops">${CROP_CALENDAR[m].join(", ")}</div>
    </div>`,
  ).join("");
  $$(".cal-month-card").forEach((el) => {
    el.addEventListener("click", () => {
      selectedCalMonth = el.dataset.month;
      renderCalendar();
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   RENDER: ORDERS TAB
══════════════════════════════════════════════════════════════ */
function renderOrders() {
  const STATUS_COLORS = {
    Confirmed: "badge-success",
    Pending: "badge-gold",
    Delivered: "badge-sage",
    Cancelled: "badge-terra",
  };

  if (orders.length === 0) {
    $("#orders-list").innerHTML = `<div class="card">
      <div class="empty-state" style="padding:48px 24px">
        <div style="font-size:48px;margin-bottom:12px">🛒</div>
        <div class="empty-title" style="font-size:18px">No orders yet</div>
        <div class="empty-sub" style="font-size:14px;margin-top:6px">Browse the market and place your first order!</div>
      </div></div>`;
    return;
  }

  const reversedOrders = [...orders].reverse();

  $("#orders-list").innerHTML = reversedOrders
    .map((o, i) => {
      const realIdx = orders.length - 1 - i; // original index in orders array
      const canCancel = o.status !== "Cancelled" && o.status !== "Delivered";
      return `
    <div class="card" style="${o.status === "Cancelled" ? "opacity:0.6" : ""}">
      <div class="order-card-inner">
        <div class="order-left">
          <span class="order-emoji">${o.produce.img}</span>
          <div>
            <div class="order-name">${o.produce.name}</div>
            <div class="order-meta">from ${o.farmer.name} · ${o.qty} ${o.produce.unit}</div>
            <div class="order-addr">📅 Delivery: ${o.date} · 📍 ${o.address.slice(0, 40)}${o.address.length > 40 ? "…" : ""}</div>
          </div>
        </div>
        <div class="order-right">
          <div class="order-price">₹${o.total}</div>
          ${badge(o.status, STATUS_COLORS[o.status] || "badge-muted")}
          <div class="order-date">${new Date(o.orderedAt).toLocaleDateString("en-IN")}</div>
          ${
            canCancel
              ? `<button class="btn btn-danger btn-sm cancel-order-btn" data-idx="${realIdx}" style="margin-top:6px;font-size:11px">✕ Cancel Order</button>`
              : ""
          }
        </div>
      </div>
    </div>`;
    })
    .join("");

  $$(".cancel-order-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = +btn.dataset.idx;
      const o = orders[idx];
      if (!confirm(`"${o.produce.name}" ka order cancel karna chahte ho?`))
        return;
      orders[idx] = { ...o, status: "Cancelled" };
      saveStorage("farmapp:orders", orders);
      updateOrderTabLabel();
      renderOrders();
      showToast(`❌ ${o.produce.name} ka order cancel ho gaya.`);
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   ORDER MODAL
══════════════════════════════════════════════════════════════ */
let currentOrderCtx = null; // { produce, farmer }
let currentQty = 1;

function openOrderModal(produce, farmer) {
  currentOrderCtx = { produce, farmer };
  currentQty = 1;
  $("#order-modal-title").textContent = `Order: ${produce.name}`;
  renderOrderForm();
  openModal("order-modal");
}

function renderOrderForm() {
  const { produce, farmer } = currentOrderCtx;
  const today = new Date().toISOString().split("T")[0];
  const total = currentQty * produce.price;

  $("#order-form-content").innerHTML = `
    <div class="order-summary">
      <span class="order-summary-emoji">${produce.img}</span>
      <div>
        <div class="order-summary-name">${produce.name}</div>
        <div class="order-summary-from">by ${farmer.name} · ${farmer.location}</div>
        <div class="order-summary-price">₹${produce.price}/${produce.unit}</div>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">QUANTITY (${produce.unit})</label>
      <div class="qty-row">
        <button class="qty-btn" id="qty-minus">−</button>
        <input class="input qty-input" id="qty-input" type="number" value="${currentQty}" min="1" max="${produce.qty}" />
        <button class="qty-btn" id="qty-plus">+</button>
        <span class="qty-max">max: ${produce.qty} ${produce.unit}</span>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">DELIVERY DATE</label>
      <input class="input" id="order-date" type="date" min="${today}" />
    </div>

    <div class="form-group">
      <label class="form-label">DELIVERY ADDRESS</label>
      <input class="input" id="order-address" type="text" placeholder="House No., Street, City, PIN" />
    </div>

    <div class="form-group">
      <label class="form-label">PHONE NUMBER</label>
      <input class="input" id="order-phone" type="tel" placeholder="+91 98765 43210" />
    </div>

    <div class="price-summary">
      <div class="price-row"><span class="muted">Subtotal</span><span>₹<span id="price-sub">${total}</span></span></div>
      <div class="price-row"><span class="muted">Delivery charge</span><span style="color:#2E7D32">Free</span></div>
      <div class="price-row total"><span>Total</span><span>₹<span id="price-total">${total}</span></span></div>
    </div>

    <div class="form-actions">
      <button class="btn btn-ghost" id="order-cancel" style="flex:1">Cancel</button>
      <button class="btn btn-primary" id="order-confirm" style="flex:2">Place Order</button>
    </div>`;

  // Qty controls
  const updateQty = () => {
    const total = currentQty * produce.price;
    $("#price-sub").textContent = total;
    $("#price-total").textContent = total;
    $("#qty-input").value = currentQty;
  };
  $("#qty-minus").addEventListener("click", () => {
    currentQty = Math.max(1, currentQty - 1);
    updateQty();
  });
  $("#qty-plus").addEventListener("click", () => {
    currentQty = Math.min(produce.qty, currentQty + 1);
    updateQty();
  });
  $("#qty-input").addEventListener("change", (e) => {
    currentQty = Math.max(1, Math.min(produce.qty, +e.target.value || 1));
    updateQty();
  });

  $("#order-cancel").addEventListener("click", () => closeModal("order-modal"));
  $("#order-confirm").addEventListener("click", () => {
    const date = $("#order-date").value;
    const address = $("#order-address").value.trim();
    const phone = $("#order-phone").value.trim();
    if (!date || !address || phone.length < 10) {
      showToast("Please fill in all fields correctly.", "error");
      return;
    }
    const newOrder = {
      produce,
      farmer,
      qty: currentQty,
      date,
      address,
      phone,
      total: currentQty * produce.price,
      status: "Confirmed",
      orderedAt: new Date().toISOString(),
    };
    orders = [...orders, newOrder];
    saveStorage("farmapp:orders", orders);
    closeModal("order-modal");
    updateOrderTabLabel();
    showToast(
      `Order placed! ${produce.name} ×${currentQty} — ₹${newOrder.total}`,
    );
  });
}

/* ══════════════════════════════════════════════════════════════
   FARMER PROFILE MODAL  (with Edit / Delete / Add Crop)
══════════════════════════════════════════════════════════════ */
let profileFarmerId = null; // currently open farmer id
let editingCropId = null; // pid being edited, or null = add-new

function openProfileModal(farmer) {
  profileFarmerId = farmer.id;
  editingCropId = null;
  renderProfileContent(farmer);
  openModal("profile-modal");
}

function renderProfileContent(farmer) {
  const UNITS = ["kg", "gram", "litre", "bunch", "piece", "dozen"];

  // Build inline edit/add form HTML
  const cropFormHTML = (crop) => {
    const c = crop || {};
    return `
    <div class="crop-edit-form" id="crop-edit-form">
      <div style="font-weight:600;font-size:13px;color:#2D5016;margin-bottom:10px">
        ${crop ? "✏️ Edit Crop" : "➕ Add New Crop"}
      </div>
      <div class="form-grid-3" style="margin-bottom:10px">
        <div><label class="form-label">CROP NAME *</label>
          <input class="input" id="ce-name" value="${c.name || ""}" placeholder="e.g. Tomatoes"/></div>
        <div><label class="form-label">PRICE (₹) *</label>
          <input class="input" id="ce-price" type="number" value="${c.price || ""}" placeholder="35"/></div>
        <div><label class="form-label">UNIT</label>
          <select class="select" id="ce-unit" style="width:100%">
            ${UNITS.map((u) => `<option${u === (c.unit || "kg") ? " selected" : ""}>${u}</option>`).join("")}
          </select></div>
      </div>
      <div class="form-grid-2" style="margin-bottom:10px">
        <div><label class="form-label">QTY AVAILABLE *</label>
          <input class="input" id="ce-qty" type="number" value="${c.qty || ""}" placeholder="100"/></div>
        <div><label class="form-label">TAG</label>
          <input class="input" id="ce-tag" value="${c.tag || ""}" placeholder="Organic, Fresh…"/></div>
      </div>
      <div class="form-actions">
        <button class="btn btn-ghost" id="ce-cancel" style="flex:1">Cancel</button>
        <button class="btn btn-primary" id="ce-save" style="flex:2">${crop ? "Save Changes" : "Add Crop"}</button>
      </div>
    </div>`;
  };

  const showingForm = editingCropId !== null; // null = hidden, "new" = add new, pid = edit
  const editingCrop =
    showingForm && editingCropId !== "new"
      ? farmer.produces.find((p) => p.id === editingCropId)
      : null;

  $("#profile-content").innerHTML = `
    <div class="profile-header">
      ${avatar(farmer.avatar, 52, "#4A7C28")}
      <div>
        <div class="profile-name-row">
          <span class="profile-name">${farmer.name}</span>
          ${farmer.verified ? badge("✓ Verified", "badge-success") : ""}
        </div>
        <div class="profile-loc">📍 ${farmer.location}</div>
        <div style="display:flex;align-items:center;gap:4px;margin-top:2px">
          ${stars(farmer.rating)}
          <span style="font-size:12px;color:#6B6B6B">(${farmer.reviews} reviews)</span>
        </div>
      </div>
    </div>
    <p class="profile-bio">${farmer.bio}</p>

    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <h3 class="profile-produce-title" style="margin:0">Available Produce</h3>
      <div style="display:flex;gap:6px">
        <button class="btn btn-outline btn-sm" id="profile-add-crop-btn" style="font-size:12px">+ Add Crop</button>
        <button class="btn btn-danger btn-sm" id="profile-delete-farmer-btn" style="font-size:12px">🗑 Delete Farmer</button>
      </div>
    </div>

    ${showingForm ? cropFormHTML(editingCrop) : ""}

    ${
      farmer.produces.length === 0
        ? `<div class="empty-state" style="padding:24px"><div class="empty-icon">🌱</div>
         <div class="empty-title">No crops yet</div>
         <div class="empty-sub">Add your first crop above!</div></div>`
        : farmer.produces
            .map(
              (p) => `
      <div class="produce-row" id="prow-${p.id}">
        <div class="produce-row-left">
          <span class="produce-row-emoji">${p.img}</span>
          <div>
            <div class="produce-row-name">${p.name}</div>
            <div class="produce-row-tags">
              ${badge(p.tag, tagColor(p.tag))}
              <span class="produce-row-qty">Qty: ${p.qty} ${p.unit}</span>
            </div>
          </div>
        </div>
        <div class="produce-row-right">
          <div class="produce-row-price">₹${p.price}</div>
          <div class="produce-row-unit">per ${p.unit}</div>
          <div style="display:flex;gap:4px;margin-top:6px;justify-content:flex-end">
            <button class="btn btn-primary btn-sm profile-order-btn"
              data-pid="${p.id}" data-fid="${farmer.id}">Order</button>
            <button class="btn btn-outline btn-sm profile-edit-btn"
              data-pid="${p.id}" data-fid="${farmer.id}" style="font-size:11px">✏️</button>
            <button class="btn btn-danger btn-sm profile-delete-btn"
              data-pid="${p.id}" data-fid="${farmer.id}" style="font-size:11px">🗑</button>
          </div>
        </div>
      </div>`,
            )
            .join("")
    }`;

  // ── Add Crop button
  $("#profile-add-crop-btn").addEventListener("click", () => {
    editingCropId = "new";
    const f = farmers.find((x) => x.id === profileFarmerId);
    renderProfileContent(f);
    document
      .getElementById("crop-edit-form")
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  // ── Delete Farmer button
  $("#profile-delete-farmer-btn").addEventListener("click", () => {
    const f = farmers.find((x) => x.id === profileFarmerId);
    if (
      !confirm(
        `"${f.name}" ko permanently delete karna chahte ho? Yeh action undo nahi hoga.`,
      )
    )
      return;
    farmers = farmers.filter((x) => x.id !== profileFarmerId);
    saveStorage("farmapp:farmers", farmers);
    closeModal("profile-modal");
    renderFarmers();
    renderMarket();
    showToast(`🗑 ${f.name} ka profile delete ho gaya.`);
  });

  // ── Cancel inside form
  if (showingForm) {
    $("#ce-cancel").addEventListener("click", () => {
      editingCropId = null;
      const f = farmers.find((x) => x.id === profileFarmerId);
      renderProfileContent(f);
    });

    // ── Save inside form
    $("#ce-save").addEventListener("click", () => {
      const name = $("#ce-name").value.trim();
      const price = +$("#ce-price").value;
      const qty = +$("#ce-qty").value;
      if (!name || !price || !qty) {
        showToast("Crop name, price aur qty zaruri hain!", "error");
        return;
      }

      const f = farmers.find((x) => x.id === profileFarmerId);
      if (editingCropId === "new") {
        // ADD new crop
        const newCrop = {
          id: `p${Date.now()}`,
          name,
          price,
          unit: $("#ce-unit").value,
          qty,
          season: [currentMonth],
          tag: $("#ce-tag").value.trim() || "Fresh",
          img: "🌱",
        };
        f.produces = [...f.produces, newCrop];
        showToast(`✅ ${name} crop add ho gaya!`);
      } else {
        // EDIT existing crop
        f.produces = f.produces.map((p) =>
          p.id === editingCropId
            ? {
                ...p,
                name,
                price,
                unit: $("#ce-unit").value,
                qty,
                tag: $("#ce-tag").value.trim() || p.tag,
              }
            : p,
        );
        showToast(`✅ ${name} update ho gaya!`);
      }
      farmers = farmers.map((x) => (x.id === f.id ? f : x));
      saveStorage("farmapp:farmers", farmers);
      editingCropId = null;
      renderProfileContent(farmers.find((x) => x.id === profileFarmerId));
    });
  }

  // ── Order buttons
  $$(".profile-order-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const f = farmers.find((x) => x.id === btn.dataset.fid);
      const p = f.produces.find((x) => x.id === btn.dataset.pid);
      closeModal("profile-modal");
      openOrderModal(p, f);
    });
  });

  // ── Edit buttons
  $$(".profile-edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      editingCropId = btn.dataset.pid;
      const f = farmers.find((x) => x.id === profileFarmerId);
      renderProfileContent(f);
      document
        .getElementById("crop-edit-form")
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });

  // ── Delete buttons
  $$(".profile-delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const f = farmers.find((x) => x.id === profileFarmerId);
      const p = f.produces.find((x) => x.id === btn.dataset.pid);
      if (!confirm(`"${p.name}" delete karna chahte ho?`)) return;
      f.produces = f.produces.filter((x) => x.id !== btn.dataset.pid);
      farmers = farmers.map((x) => (x.id === f.id ? f : x));
      saveStorage("farmapp:farmers", farmers);
      showToast(`🗑 ${p.name} delete ho gaya.`);
      renderProfileContent(farmers.find((x) => x.id === profileFarmerId));
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   FARMER REGISTRATION MODAL  (multi-crop support)
══════════════════════════════════════════════════════════════ */
let regCrops = []; // array of { name, price, unit, qty, tag }

function openRegisterModal() {
  regCrops = [{ name: "", price: "", unit: "kg", qty: "", tag: "" }]; // start with one blank crop
  renderRegisterModal();
  openModal("register-modal");
}

function renderRegisterModal() {
  const UNITS = ["kg", "gram", "litre", "bunch", "piece", "dozen"];

  const cropsHTML = regCrops
    .map(
      (c, i) => `
    <div class="reg-crop-block" style="background:#f0ede5;border-radius:10px;padding:12px 14px;margin-bottom:10px;position:relative">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <span style="font-size:12px;font-weight:600;color:#4A7C28">🌱 Crop ${i + 1}</span>
        ${
          regCrops.length > 1
            ? `<button class="btn btn-danger btn-sm reg-remove-crop" data-idx="${i}" style="font-size:11px;padding:3px 8px">✕ Remove</button>`
            : ""
        }
      </div>
      <div class="form-grid-3" style="margin-bottom:8px">
        <div><label class="form-label">CROP NAME *</label>
          <input class="input reg-crop-name" data-idx="${i}" value="${c.name}" placeholder="e.g. Tomatoes"/></div>
        <div><label class="form-label">PRICE (₹) *</label>
          <input class="input reg-crop-price" data-idx="${i}" type="number" value="${c.price}" placeholder="35"/></div>
        <div><label class="form-label">UNIT</label>
          <select class="select reg-crop-unit" data-idx="${i}" style="width:100%">
            ${UNITS.map((u) => `<option${u === c.unit ? " selected" : ""}>${u}</option>`).join("")}
          </select></div>
      </div>
      <div class="form-grid-2">
        <div><label class="form-label">QTY AVAILABLE *</label>
          <input class="input reg-crop-qty" data-idx="${i}" type="number" value="${c.qty}" placeholder="100"/></div>
        <div><label class="form-label">TAG</label>
          <input class="input reg-crop-tag" data-idx="${i}" value="${c.tag}" placeholder="Organic, Fresh…"/></div>
      </div>
    </div>`,
    )
    .join("");

  $("#register-form-content").innerHTML = `
    <div class="form-grid-2" style="margin-bottom:13px">
      <div><label class="form-label">FULL NAME *</label><input class="input" id="r-name" placeholder="Your name" value="${$("#r-name")?.value || ""}"/></div>
      <div><label class="form-label">LOCATION *</label><input class="input" id="r-loc" placeholder="Village, District" value="${$("#r-loc")?.value || ""}"/></div>
    </div>
    <div class="form-group"><label class="form-label">BIO</label>
      <input class="input" id="r-bio" placeholder="Tell buyers about your farm…" value="${$("#r-bio")?.value || ""}"/></div>
    <div class="form-group"><label class="form-label">PHONE *</label>
      <input class="input" id="r-phone" type="tel" placeholder="+91 ..." value="${$("#r-phone")?.value || ""}"/></div>

    <hr class="dashed-hr" style="margin:10px 0"/>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <span style="font-weight:600;font-size:13px;color:#2D5016">🌾 Fasal Ki Jankari (Crops)</span>
      <span style="font-size:11px;color:#6B6B6B">${regCrops.length} crop${regCrops.length > 1 ? "s" : ""} added</span>
    </div>

    <div id="reg-crops-container">${cropsHTML}</div>

    <button class="btn btn-outline" id="reg-add-more-crop" style="width:100%;margin-bottom:14px;border-style:dashed">
      + Add More Crop
    </button>

    <div class="form-actions">
      <button class="btn btn-ghost" id="r-cancel" style="flex:1">Cancel</button>
      <button class="btn btn-primary" id="r-save" style="flex:2">✅ Register as Farmer</button>
    </div>`;

  // ── Save crop state when user types (before re-render)
  function syncCropsFromDOM() {
    $$(".reg-crop-name").forEach((el) => {
      regCrops[+el.dataset.idx].name = el.value;
    });
    $$(".reg-crop-price").forEach((el) => {
      regCrops[+el.dataset.idx].price = el.value;
    });
    $$(".reg-crop-unit").forEach((el) => {
      regCrops[+el.dataset.idx].unit = el.value;
    });
    $$(".reg-crop-qty").forEach((el) => {
      regCrops[+el.dataset.idx].qty = el.value;
    });
    $$(".reg-crop-tag").forEach((el) => {
      regCrops[+el.dataset.idx].tag = el.value;
    });
  }

  // ── Add more crop button
  $("#reg-add-more-crop").addEventListener("click", () => {
    syncCropsFromDOM();
    regCrops.push({ name: "", price: "", unit: "kg", qty: "", tag: "" });
    renderRegisterModal();
    // scroll to bottom of modal
    const box = $("#register-modal .modal-box");
    box.scrollTop = box.scrollHeight;
  });

  // ── Remove crop buttons
  $$(".reg-remove-crop").forEach((btn) => {
    btn.addEventListener("click", () => {
      syncCropsFromDOM();
      regCrops.splice(+btn.dataset.idx, 1);
      renderRegisterModal();
    });
  });

  // ── Cancel
  $("#r-cancel").addEventListener("click", () => {
    regCrops = [];
    closeModal("register-modal");
  });

  // ── Register submit
  $("#r-save").addEventListener("click", () => {
    syncCropsFromDOM();
    const name = $("#r-name").value.trim();
    const loc = $("#r-loc").value.trim();
    const phone = $("#r-phone").value.trim();

    if (!name || !loc || !phone) {
      showToast("Naam, location aur phone zaruri hain!", "error");
      return;
    }
    // Validate crops
    for (let i = 0; i < regCrops.length; i++) {
      const c = regCrops[i];
      if (!c.name.trim() || !+c.price || !+c.qty) {
        showToast(`Crop ${i + 1}: naam, price aur qty zaruri hain!`, "error");
        return;
      }
    }

    const initials = name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const ts = Date.now();
    const newFarmer = {
      id: `f${ts}`,
      name,
      location: loc,
      avatar: initials,
      bio: $("#r-bio").value.trim() || `Farmer from ${loc}.`,
      rating: 4.5,
      reviews: 0,
      verified: false,
      produces: regCrops.map((c, i) => ({
        id: `p${ts}${i}`,
        name: c.name.trim(),
        price: +c.price,
        unit: c.unit,
        qty: +c.qty,
        season: [currentMonth],
        tag: c.tag.trim() || "Fresh",
        img: "🌱",
      })),
    };
    farmers = [...farmers, newFarmer];
    saveStorage("farmapp:farmers", farmers);
    regCrops = [];
    closeModal("register-modal");
    showToast(`🎉 Welcome, ${name}! Aapki farm profile live ho gayi!`);
    renderFarmers();
  });
}

/* ══════════════════════════════════════════════════════════════
   AI ASSISTANT
══════════════════════════════════════════════════════════════ */
function renderAIMessages() {
  const container = $("#ai-messages");
  container.innerHTML =
    aiMessages
      .map(
        (m) =>
          `<div style="display:flex;justify-content:${m.role === "user" ? "flex-end" : "flex-start"}">
       <div class="ai-bubble ${m.role}">${m.content}</div>
     </div>`,
      )
      .join("") +
    (aiLoading
      ? `<div style="display:flex"><div class="ai-bubble typing">Typing…</div></div>`
      : "");
  container.scrollTop = container.scrollHeight;
}

async function sendAIMessage() {
  const input = $("#ai-input");
  const msg = input.value.trim();
  if (!msg || aiLoading) return;
  input.value = "";
  aiMessages = [...aiMessages, { role: "user", content: msg }];
  aiLoading = true;
  renderAIMessages();

  const allProduce = getAllProduce();
  const context = `You are KisanAI, a helpful farming assistant for a local farmer-to-consumer market in Rajasthan, India. Current month: ${currentMonth}. Available produce: ${allProduce.map((p) => `${p.name} (₹${p.price}/${p.unit}) from ${p.farmerName}`).join(", ")}. Respond concisely and helpfully in English. For local terms, add brief Hindi.`;

  const history = aiMessages
    .filter((m, i) => !(m.role === "assistant" && i === 0))
    .map((m) => ({ role: m.role, content: m.content }));

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: context,
        messages: history,
      }),
    });
    const data = await res.json();
    const reply = data.content?.[0]?.text || "Sorry, I couldn't process that.";
    aiMessages = [...aiMessages, { role: "assistant", content: reply }];
  } catch {
    aiMessages = [
      ...aiMessages,
      {
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
      },
    ];
  }

  aiLoading = false;
  renderAIMessages();
}

/* ── ORDER TAB LABEL ────────────────────────────────────────── */
function updateOrderTabLabel() {
  const btn = $("#orders-tab-btn");
  btn.textContent = orders.length
    ? `🛒 Orders (${orders.length})`
    : "🛒 Orders";
}

/* ══════════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════════ */
window.addEventListener("DOMContentLoaded", () => {
  // Season badge + dropdown
  $("#season-badge").textContent = `🌱 ${currentMonth} Season`;
  MONTHS.forEach((m) => {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = m;
    $("#season-filter").appendChild(opt);
  });

  // Tab buttons
  $$(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

  // Sell / Register buttons
  $("#header-sell-btn").addEventListener("click", openRegisterModal);
  $("#farmers-sell-btn").addEventListener("click", openRegisterModal);

  // Filters trigger re-render
  ["search-input", "season-filter", "loc-filter"].forEach((id) => {
    $(`#${id}`).addEventListener("input", () => renderMarket());
  });

  // Close modals via × button
  $$(".modal-close").forEach((btn) => {
    btn.addEventListener("click", () => closeModal(btn.dataset.close));
  });
  // Close modal by clicking overlay
  $$(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.classList.add("hidden");
    });
  });

  // AI
  $("#ai-fab").addEventListener("click", () => {
    openModal("ai-modal");
    renderAIMessages();
  });
  $("#ai-send-btn").addEventListener("click", sendAIMessage);
  $("#ai-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendAIMessage();
  });

  // Initial render
  updateOrderTabLabel();
  renderMarket();
});
