const MARKETS_API = "https://admin.gvsc.myaibusiness.online/api/market_lists";
const SETTINGS_API = "https://admin.gvsc.myaibusiness.online/api/getSetting";
const OPEN_RESULT = "**";

const state = {
  page: "home",
  chartMarket: "",
  chartYear: 2026,
  markets: FALLBACK_MARKETS.slice(),
  contact: CONTACT_FALLBACK,
  telegram: TELEGRAM_URL,
  scrollTo: "",
};

const app = document.getElementById("app");
const drawer = document.getElementById("market-drawer");
const backdrop = document.getElementById("drawer-backdrop");
const formNotice = document.getElementById("form-notice");
const callLink = document.getElementById("call-link");
const waLink = document.getElementById("wa-link");

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function nameSlug(name) {
  return String(name || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
}

function indiaPhone(number) {
  let digits = String(number || "").replace(/\D/g, "");
  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  if (digits.startsWith("91") && digits.length === 12) {
    return digits;
  }
  if (digits.length === 10) {
    return "91" + digits;
  }
  return digits;
}

function middleResult(result) {
  const value = String(result || "").trim();
  if (!value || value === "**" || value === "*** ** ***") {
    return OPEN_RESULT;
  }

  const parts = value.replace(/[-_+]/g, " ").split(/\s+/).filter(Boolean);
  if (parts.length >= 3) {
    return parts[1];
  }
  if (parts.length === 2) {
    return parts.find((part) => part.length === 2) || parts[1];
  }
  if (parts[0] && parts[0].length <= 2) {
    return parts[0];
  }
  return OPEN_RESULT;
}

function findMarket(idOrName) {
  const sel = String(idOrName || "").toLowerCase();
  return (
    state.markets.find(
      (market) =>
        String(market.market_id).toLowerCase() === sel ||
        nameSlug(market.market_name) === sel
    ) ||
    CHART_MARKETS.find((market) => market.id === sel) ||
    null
  );
}

function marketIndex(id) {
  const idx = CHART_MARKETS.findIndex((market) => market.id === id);
  return idx >= 0 ? idx : 0;
}

function liveJodi(marketId) {
  const market = findMarket(marketId);
  if (!market || !market.result) {
    return OPEN_RESULT;
  }
  return middleResult(market.result);
}

function marketDisplayName(id) {
  const live = findMarket(id);
  if (live && live.market_name) {
    return live.market_name;
  }
  const chart = CHART_MARKETS.find((market) => market.id === id);
  return chart ? chart.name : id;
}

function parseRoute() {
  const hash = (location.hash || "#home").replace("#", "");
  const [page, market, year] = hash.split("/");

  if (page === "leak-jodi" || page === "month-chart") {
    state.page = "home";
    state.scrollTo = page;
    return;
  }

  if (page === "list-market") {
    state.page = "home";
    openDrawer();
    return;
  }

  if (["privacy", "disclaimer", "about", "sitemap"].includes(page)) {
    state.page = page;
    return;
  }

  if (page === "chart" && market) {
    state.page = "year";
    state.chartMarket = decodeURIComponent(market);
    state.chartYear = Number(year) || 2026;
    return;
  }

  state.page = "home";
}

function updateContactLinks() {
  const phone = indiaPhone(state.contact);
  if (callLink) {
    callLink.href = `tel:+${phone}`;
    callLink.textContent = `Call ${state.contact}`;
  }
  if (waLink) {
    waLink.href = `https://wa.me/${phone}`;
  }
}

function openDrawer() {
  drawer.classList.add("is-open");
  backdrop.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("drawer-open");
}

function closeDrawer() {
  drawer.classList.remove("is-open");
  backdrop.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("drawer-open");
  if ((location.hash || "").replace("#", "") === "list-market") {
    history.replaceState(null, "", "#home");
  }
}

function toAmPm(time) {
  if (!time) {
    return "-";
  }
  const parts = String(time).split(":");
  const hour = Number(parts[0]);
  const minute = (parts[1] || "00").slice(0, 2);
  if (Number.isNaN(hour)) {
    return String(time);
  }
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute} ${suffix}`;
}

function hindiIntro(extra) {
  return `
    <section class="copy-block">
      <p>${SITE_COPY.intro}</p>
      ${extra ? `<p>${extra}</p>` : ""}
    </section>
  `;
}

function telegramBlock() {
  return `
    <a class="telegram-btn" href="${escapeHtml(state.telegram)}" target="_blank" rel="noopener noreferrer">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9.04 15.3 8.9 19.1c.3 0 .44-.13.6-.3l1.44-1.38 2.98 2.18c.55.3.94.14 1.1-.5l2-9.4c.18-.82-.3-1.14-.83-.94L5.1 11.3c-.8.3-.79.76-.14.96l3.46 1.08 8.04-5.06c.38-.23.72-.1.44.15z"/></svg>
      <span>Join Telegram / टेलीग्राम जॉइन करें</span>
    </a>
  `;
}

function liveResultsBoard(markets) {
  const rows = markets
    .map((market) => {
      const jodi = middleResult(market.result);
      const live = jodi !== OPEN_RESULT;
      return `
        <article class="live-item">
          <h2>${escapeHtml(market.market_name)} <span class="rgb-live">(LIVE)</span></h2>
          <p class="live-num ${live ? "is-live" : "is-wait"}">${escapeHtml(jodi)}</p>
        </article>
      `;
    })
    .join("");

  return `
    <section class="hero-live" id="live-results">
      <div class="hero-bar">
        <p>BEST SITE MATKA RESULT !</p>
        <strong>
          <span class="neon-domain">WWW.MATKAKING.COM</span>
          <span class="rgb-live">(LIVE)</span>
        </strong>
      </div>
      <div class="hero-body">
        <p class="live-clock" id="live-clock">${formatIndiaDateTime()}</p>
        <p class="live-kicker">All in one Matka Result Today</p>
        <div class="live-grid">${rows}</div>
      </div>
    </section>
  `;
}

function leakJodiBlock() {
  const phone = indiaPhone(state.contact);
  const rows = state.markets
    .map((market) => {
      const hindi = MARKET_HINDI[market.market_id] || market.market_name;
      return `
        <li>
          <span class="leak-dot"></span>
          <span class="leak-name">${escapeHtml(hindi)}</span>
          <strong class="leak-stars">*****</strong>
        </li>
      `;
    })
    .join("");

  return `
    <section class="leak-board" id="leak-jodi">
      <h2>LEAK JODI</h2>
      <ul class="leak-times">${rows}</ul>
      <p class="leak-rate">Rate : 10 के 950</p>
      <p class="leak-fast">Fast service</p>
      <div class="leak-actions">
        <a class="whatsapp-pill" href="https://wa.me/${phone}" target="_blank" rel="noopener noreferrer">
          <img src="assets/whatsapp.png" alt=""> WhatsApp
        </a>
        <a class="telegram-pill" href="${escapeHtml(state.telegram)}" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9.04 15.3 8.9 19.1c.3 0 .44-.13.6-.3l1.44-1.38 2.98 2.18c.55.3.94.14 1.1-.5l2-9.4c.18-.82-.3-1.14-.83-.94L5.1 11.3c-.8.3-.79.76-.14.96l3.46 1.08 8.04-5.06c.38-.23.72-.1.44.15z"/></svg>
          Telegram
        </a>
      </div>
    </section>
  `;
}

function monthlyTable(marketIds) {
  const today = istParts();
  const year = today.year;
  const monthIndex = today.month - 1;
  const totalDays = daysInMonth(year, monthIndex);
  const heads = marketIds
    .map((id) => `<th>${escapeHtml(marketDisplayName(id))}</th>`)
    .join("");

  const rows = [];
  for (let day = 1; day <= totalDays; day += 1) {
    const cells = marketIds
      .map((id) => {
        const value = chartCell(marketIndex(id), year, monthIndex, day, liveJodi(id));
        const pending = value === "**" || value === "-";
        const live = !pending && value !== "";
        return `<td class="${pending ? "is-pending" : ""} ${live ? "is-hit" : ""}">${escapeHtml(value)}</td>`;
      })
      .join("");
    const dateLabel = `${pad2(day)}-${pad2(monthIndex + 1)}-${year}`;
    const isToday = day === today.day && year === today.year && monthIndex === today.month - 1;
    rows.push(`<tr class="${isToday ? "is-today" : ""}"><th>${dateLabel}</th>${cells}</tr>`);
  }

  return `
    <div class="table-wrap">
      <table class="result-table">
        <thead>
          <tr>
            <th>DATE</th>
            ${heads}
          </tr>
        </thead>
        <tbody>${rows.join("")}</tbody>
      </table>
    </div>
  `;
}

function homeCharts() {
  const today = istParts();
  const monthName = new Intl.DateTimeFormat("en-US", {
    month: "long",
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  return `
    ${telegramBlock()}
    <section class="panel" id="month-chart">
      <h2 class="panel-bar">All in one Matka Result ${monthName} ${today.year}</h2>
      <p class="protect-badge">All in one Matka Result Protected</p>
      ${monthlyTable(HOME_CHART_MARKETS)}
    </section>
  `;
}

function recordCharts() {
  const blocks = CHART_YEARS.map((year) => {
    const links = CHART_MARKETS.map(
      (market) => `
        <a href="#chart/${encodeURIComponent(market.id)}/${year}">
          ${escapeHtml(market.name)} ${year}
        </a>
      `
    ).join("");

    return `
      <section class="panel record-panel">
        <h2 class="panel-bar">ALL IN ONE MATKA RESULT CHART ${year}</h2>
        <div class="record-list">${links}</div>
      </section>
    `;
  }).join("");

  return `<div id="record-charts">${blocks}</div>`;
}

function yearTable(marketId, year) {
  const index = marketIndex(marketId);
  const today = istParts();
  const heads = MONTH_LABELS.map((label) => `<th>${label}</th>`).join("");
  const rows = [];

  for (let day = 1; day <= 31; day += 1) {
    const cells = MONTH_LABELS.map((_, monthIndex) => {
      const value = chartCell(index, year, monthIndex, day, liveJodi(marketId));
      const pending = value === "**" || value === "-" || value === "";
      const isToday = year === today.year && monthIndex === today.month - 1 && day === today.day;
      return `<td class="${pending ? "is-pending" : ""} ${isToday ? "is-today" : ""}">${escapeHtml(value)}</td>`;
    }).join("");
    rows.push(`<tr><th>${day}</th>${cells}</tr>`);
  }

  return `
    <div class="table-wrap">
      <table class="result-table year-table">
        <thead>
          <tr>
            <th>DATE</th>
            ${heads}
          </tr>
        </thead>
        <tbody>${rows.join("")}</tbody>
      </table>
    </div>
  `;
}

function renderLegal(title, body) {
  return `
    <article class="legal-page">
      <a class="text-link" href="#home">← Back to All in one Matka Result</a>
      <h1>${title}</h1>
      <p>${body}</p>
    </article>
  `;
}

function renderSitemap() {
  const yearLinks = CHART_YEARS.map(
    (year) => `<a href="#home">Record Chart ${year}</a>`
  ).join("");
  return `
    <article class="legal-page">
      <a class="text-link" href="#home">← Back to All in one Matka Result</a>
      <h1>Sitemap</h1>
      <div class="sitemap-list">
        <a href="#home">Home / Live Result</a>
        <a href="#leak-jodi">Leak Jodi</a>
        <a href="#month-chart">All in one Matka Result Chart</a>
        <a href="#about">About Us</a>
        <a href="#privacy">Privacy Policy</a>
        <a href="#disclaimer">Disclaimer</a>
        ${yearLinks}
      </div>
    </article>
  `;
}

function renderHome() {
  return `
    ${hindiIntro()}
    ${liveResultsBoard(state.markets)}
    ${homeCharts()}
    ${telegramBlock()}
    ${leakJodiBlock()}
    ${recordCharts()}
  `;
}

function renderYear() {
  const name = marketDisplayName(state.chartMarket);
  const jodi = liveJodi(state.chartMarket);
  const year = CHART_YEARS.includes(state.chartYear) ? state.chartYear : 2026;
  const live = jodi !== OPEN_RESULT;

  return `
    ${hindiIntro(SITE_COPY.yearIntro)}
    <section class="hero-live">
      <div class="hero-bar">
        <p>BEST SITE MATKA RESULT !</p>
        <strong>
          <span class="neon-domain">WWW.MATKAKING.COM</span>
          <span class="rgb-live">(LIVE)</span>
        </strong>
      </div>
      <div class="hero-body">
        <p class="live-clock" id="live-clock">${formatIndiaDateTime()}</p>
        <p class="live-kicker">All in one Matka Result Today</p>
        <h1>${escapeHtml(name)} <span class="rgb-live">(LIVE)</span></h1>
        <p class="live-num live-num--xl ${live ? "is-live" : "is-wait"}">${escapeHtml(jodi)}</p>
        <a class="text-link" href="#home">← Back to All in one Matka Result</a>
      </div>
      <div class="hero-bar hero-bar--sub">
        <strong>ALL IN ONE MATKA RESULT CHART</strong>
      </div>
    </section>
    ${telegramBlock()}
    <section class="panel">
      <h2 class="panel-bar">${escapeHtml(name)} RECORD CHART ${year}</h2>
      ${yearTable(state.chartMarket, year)}
    </section>
    ${recordCharts()}
  `;
}

function bindClock() {
  const clock = document.getElementById("live-clock");
  if (!clock) {
    return;
  }
  clock.textContent = formatIndiaDateTime();
}

function render(options = {}) {
  parseRoute();
  if (state.page === "year") {
    app.innerHTML = renderYear();
  } else if (state.page === "privacy") {
    app.innerHTML = renderLegal("Privacy Policy", SITE_COPY.privacy);
  } else if (state.page === "disclaimer") {
    app.innerHTML = renderLegal("Disclaimer", SITE_COPY.disclaimer);
  } else if (state.page === "about") {
    app.innerHTML = renderLegal("About Us", SITE_COPY.footerAbout);
  } else if (state.page === "sitemap") {
    app.innerHTML = renderSitemap();
  } else {
    app.innerHTML = renderHome();
  }
  bindClock();
  if (state.scrollTo) {
    document.getElementById(state.scrollTo)?.scrollIntoView({ behavior: "smooth", block: "start" });
    state.scrollTo = "";
  } else if (options.scrollTop) {
    window.scrollTo(0, 0);
  }
}

document.getElementById("open-form").addEventListener("click", openDrawer);
document.getElementById("drawer-close").addEventListener("click", closeDrawer);
backdrop.addEventListener("click", closeDrawer);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDrawer();
  }
});

document.getElementById("market-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const phone = indiaPhone(state.contact);
  const text = encodeURIComponent(
    `All in one Matka Result market listing request\nName: ${data.get("name")}\nPhone: ${data.get("phone")}\nMarket: ${data.get("market")}\nCity: ${data.get("city") || "-"}\nMessage: ${data.get("message") || "-"}`
  );

  formNotice.hidden = false;
  formNotice.textContent =
    "Request ready. Finish sending it on WhatsApp, or call the number below.";
  window.open(`https://wa.me/${phone}?text=${text}`, "_blank", "noopener,noreferrer");
});

window.addEventListener("hashchange", () => render({ scrollTop: true }));
setInterval(bindClock, 30000);

document.getElementById("refresh-page")?.addEventListener("click", () => {
  location.reload();
});

function stampUpdated() {
  const node = document.getElementById("last-updated");
  if (node) {
    node.textContent = `Last Updated: ${formatIndiaDateTime()}`;
  }
}
stampUpdated();
setInterval(stampUpdated, 30000);

async function loadSettings() {
  try {
    const response = await fetch(SETTINGS_API, { cache: "no-store" });
    const data = await response.json();
    const settings = data.data || {};
    state.contact = settings.contact_no || settings.telegram_no || CONTACT_FALLBACK;
    if (settings.telegram_url || settings.telegram) {
      state.telegram = settings.telegram_url || settings.telegram;
    }
  } catch (error) {
    state.contact = CONTACT_FALLBACK;
  }
  updateContactLinks();
}

async function loadMarkets() {
  try {
    const response = await fetch(MARKETS_API, {
      method: "GET",
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    const data = await response.json();
    const list = Array.isArray(data.data) ? data.data : [];
    if (data.status !== 0 && list.length) {
      state.markets = list;
      render();
    }
  } catch (error) {
    state.markets = FALLBACK_MARKETS.slice();
  }
}

updateContactLinks();
loadSettings();
loadMarkets();
render({ scrollTop: true });
