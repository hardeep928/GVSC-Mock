const MARKETS_API = "https://admin.gvsc.myaibusiness.online/api/market_lists";
const SETTINGS_API = "https://admin.gvsc.myaibusiness.online/api/getSetting";
const OPEN_RESULT = "**";
const CONTACT_FALLBACK = "9929624882";

const START_KEYS = ["o_start_time", "open_time", "start_time", "o_start", "open_start_time"];
const OPEN_CLOSE_KEYS = ["o_end_time", "open_end_time", "open_close_time"];
const CLOSE_START_KEYS = ["c_start_time", "close_start_time"];
const CLOSE_END_KEYS = ["c_end_time", "close_time", "end_time", "close_end_time"];
const RESULT_TIME_KEYS = ["result_time", "r_time"];

const state = {
  page: "markets",
  chartMarket: "all",
  chartDate: "all",
  chartPage: 1,
  chartPageSize: 10,
  markets: [],
  marketsLoading: true,
  contact: CONTACT_FALLBACK,
  formNotice: "",
};

const app = document.getElementById("app");
const sidebar = document.getElementById("sidebar");
const backdrop = document.getElementById("backdrop");
const menuToggle = document.getElementById("menu-toggle");

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pickField(item, keys) {
  for (const key of keys) {
    if (item[key] !== undefined && item[key] !== null && String(item[key]).trim() !== "") {
      return item[key];
    }
  }
  return "";
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
  return `${String(hour12).padStart(2, "0")}:${minute} ${suffix}`;
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

function resultPartsHtml(result) {
  return `<span class="result-part result-part--1">${escapeHtml(middleResult(result))}</span>`;
}

function toIsoDate(displayDate) {
  if (!displayDate || displayDate === "all") {
    return "";
  }
  const [day, month, year] = String(displayDate).split("-");
  if (!year || !month || !day) {
    return "";
  }
  return `${year}-${month}-${day}`;
}

function fromIsoDate(isoDate) {
  if (!isoDate) {
    return "all";
  }
  const [year, month, day] = String(isoDate).split("-");
  return `${day}-${month}-${year}`;
}

function chartIsoRange() {
  const dates = CHART_RESULTS.map((row) => toIsoDate(row.date)).filter(Boolean).sort();
  return {
    min: dates[0] || "",
    max: dates[dates.length - 1] || "",
  };
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

function closeSidebar() {
  sidebar.classList.remove("is-open");
  backdrop.classList.remove("is-open");
}

function setActiveNav() {
  document.querySelectorAll(".side-nav a").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.page === state.page);
  });
}

function parseRoute() {
  const hash = (location.hash || "#markets").replace("#", "");
  const [page, param] = hash.split("/");
  const known = ["markets", "chart", "leak-jodi", "list-market"];
  state.page = known.includes(page) ? page : "markets";

  if (state.page === "chart") {
    const nextMarket = param ? decodeURIComponent(param) : "all";
    if (nextMarket !== state.chartMarket) {
      state.chartMarket = nextMarket;
      state.chartPage = 1;
    }
  }
}

function goChart(marketId) {
  state.chartMarket = marketId || "all";
  state.chartPage = 1;
  location.hash =
    marketId && marketId !== "all" ? `#chart/${encodeURIComponent(marketId)}` : "#chart";
}

function timings(market) {
  return [
    { label: "Start", value: toAmPm(pickField(market, START_KEYS)) },
    { label: "Close", value: toAmPm(pickField(market, OPEN_CLOSE_KEYS)) },
    { label: "Open Start", value: toAmPm(pickField(market, START_KEYS)) },
    { label: "Open Close", value: toAmPm(pickField(market, OPEN_CLOSE_KEYS)) },
    { label: "Close Start", value: toAmPm(pickField(market, CLOSE_START_KEYS)) },
    { label: "Close End", value: toAmPm(pickField(market, CLOSE_END_KEYS)) },
    { label: "Result Time", value: toAmPm(pickField(market, RESULT_TIME_KEYS)) },
  ].filter((item) => item.value !== "-");
}

function renderMarkets() {
  if (state.marketsLoading) {
    return `
      <section class="page">
        <div class="page-head">
          <p class="eyebrow">Live board</p>
          <h1>All Markets</h1>
        </div>
        <p class="empty-note">Loading markets...</p>
      </section>
    `;
  }

  const cards = state.markets
    .map((market) => {
      const running = market.running_status === true;
      const id = nameSlug(market.market_name);
      const timeItems = timings(market)
        .map(
          (item) => `
            <div class="time-chip">
              <span>${item.label}</span>
              <strong>${item.value}</strong>
            </div>
          `
        )
        .join("");

      return `
        <article class="market-card ${running ? "is-running" : "is-closed"}">
          <div class="market-top">
            <div>
              <h2>${escapeHtml(market.market_name || "Market")}</h2>
              <span class="status-pill">${running ? "Open" : "Closed"}</span>
            </div>
            <button class="ghost-btn" type="button" data-chart="${id}">View Chart</button>
          </div>
          <div class="market-result">${resultPartsHtml(market.result)}</div>
          <div class="time-grid">${timeItems}</div>
        </article>
      `;
    })
    .join("");

  return `
    <section class="page">
      <div class="page-head">
        <p class="eyebrow">Information board</p>
        <h1>All Markets</h1>
        <p>Market names, start and close timings, and today's result. This is an information website only — there is no Play Now option here.</p>
      </div>
      <div class="market-grid">${cards}</div>
    </section>
  `;
}

function matchesMarket(row, selected) {
  if (!selected || selected === "all") {
    return true;
  }
  const sel = String(selected).toLowerCase();
  return (
    String(row.marketId).toLowerCase() === sel ||
    nameSlug(row.marketName) === sel ||
    row.marketName.toLowerCase() === sel
  );
}

function filteredChartRows() {
  return CHART_RESULTS.filter((row) => {
    const marketOk = matchesMarket(row, state.chartMarket);
    const dateOk = state.chartDate === "all" || row.date === state.chartDate;
    return marketOk && dateOk;
  });
}

function renderChart() {
  const rows = filteredChartRows();
  const total = rows.length;
  const size = state.chartPageSize;
  const pages = Math.max(1, Math.ceil(total / size));
  if (state.chartPage > pages) {
    state.chartPage = pages;
  }

  const start = (state.chartPage - 1) * size;
  const pageRows = rows.slice(start, start + size);
  const range = chartIsoRange();
  const marketOptions = [
    `<option value="all"${state.chartMarket === "all" ? " selected" : ""}>All Markets</option>`,
    ...CHART_MARKETS.map(
      (market) =>
        `<option value="${market.id}"${state.chartMarket === market.id ? " selected" : ""}>${market.name}</option>`
    ),
  ].join("");

  const tableRows = pageRows
    .map(
      (row) => `
        <tr>
          <td>${row.date}</td>
          <td>${row.marketName}</td>
          <td class="result-cell">${resultPartsHtml(row.result)}</td>
        </tr>
      `
    )
    .join("");

  const visiblePages = [];
  for (let page = 1; page <= pages; page += 1) {
    if (page === 1 || page === pages || Math.abs(page - state.chartPage) <= 2) {
      visiblePages.push(page);
    } else if (visiblePages[visiblePages.length - 1] !== "gap") {
      visiblePages.push("gap");
    }
  }
  const pageButtons = visiblePages
    .map((page) =>
      page === "gap"
        ? `<span class="page-gap">...</span>`
        : `<button type="button" class="page-btn${page === state.chartPage ? " is-active" : ""}" data-page-number="${page}">${page}</button>`
    )
    .join("");

  return `
    <section class="page">
      <div class="page-head">
        <p class="eyebrow">Old results</p>
        <h1>Market Chart</h1>
        <p>Latest results stay on top. Filter by market, then choose how many rows to show. Client results can replace this sample data later.</p>
      </div>

      <div class="toolbar">
        <label>
          Market
          <select id="chart-market">${marketOptions}</select>
        </label>
        <label>
          Date
          <span class="date-field">
            <input id="chart-date" type="date" value="${toIsoDate(state.chartDate)}" min="${range.min}" max="${range.max}">
            <button type="button" class="clear-date" id="chart-date-clear"${state.chartDate === "all" ? " disabled" : ""}>Clear</button>
          </span>
        </label>
        <label>
          Show
          <select id="chart-size">
            <option value="10"${size === 10 ? " selected" : ""}>10</option>
            <option value="40"${size === 40 ? " selected" : ""}>40</option>
            <option value="100"${size === 100 ? " selected" : ""}>100</option>
          </select>
        </label>
        <p class="toolbar-meta">Showing ${total ? start + 1 : 0}-${Math.min(start + size, total)} of ${total}</p>
      </div>

      <div class="table-wrap">
        <table class="chart-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Market</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            ${
              tableRows ||
              `<tr><td colspan="3" class="empty-note">No chart data for this market yet.</td></tr>`
            }
          </tbody>
        </table>
      </div>
      <div class="chart-cards">
        ${
          pageRows
            .map(
              (row) => `
                <article class="chart-card">
                  <div>
                    <strong>${row.marketName}</strong>
                    <span>${row.date}</span>
                  </div>
                  <div class="result-cell">${resultPartsHtml(row.result)}</div>
                </article>
              `
            )
            .join("") || `<p class="empty-note">No chart data for this market yet.</p>`
        }
      </div>

      <div class="pagination">
        <button type="button" data-page-number="${Math.max(1, state.chartPage - 1)}"${state.chartPage === 1 ? " disabled" : ""}>Prev</button>
        <div class="page-list">${pageButtons}</div>
        <button type="button" data-page-number="${Math.min(pages, state.chartPage + 1)}"${state.chartPage === pages ? " disabled" : ""}>Next</button>
      </div>
    </section>
  `;
}

function renderLeakJodi() {
  const cards = LEAK_JODI.map(
    (item) => `
      <article class="leak-card">
        <div class="leak-top">
          <h2>${item.marketName}</h2>
          <span>${item.tag}</span>
        </div>
        <p class="leak-date">${item.date}</p>
        <p class="leak-jodi">${item.jodi}</p>
        <div class="leak-meta">
          <span>Open ${item.openLeak}</span>
          <span>Close ${item.closeLeak}</span>
        </div>
      </article>
    `
  ).join("");

  return `
    <section class="page">
      <div class="page-head">
        <p class="eyebrow">Today's leak</p>
        <h1>Leak Jodi</h1>
        <p>Sample leak jodi board for each listed market. Swap these numbers when the client sends the live list.</p>
      </div>
      <div class="leak-grid">${cards}</div>
    </section>
  `;
}

function renderListMarket() {
  const phone = indiaPhone(state.contact);
  const notice = state.formNotice ? `<p class="form-success">${state.formNotice}</p>` : "";

  return `
    <section class="page">
      <div class="page-head">
        <p class="eyebrow">Partnership</p>
        <h1>List Your Market</h1>
        <p>Send a request to add your market, or contact the team directly on the number.</p>
      </div>

      <div class="split">
        <form class="market-form" id="market-form">
          ${notice}
          <label>Full name<input name="name" required placeholder="Your name"></label>
          <label>Mobile number<input name="phone" required placeholder="10 digit number"></label>
          <label>Market name<input name="market" required placeholder="Market you want to list"></label>
          <label>City / area<input name="city" placeholder="City"></label>
          <label>Message<textarea name="message" rows="4" placeholder="Timings, result window, or anything we should know"></textarea></label>
          <button class="gold-btn" type="submit">Send request</button>
        </form>

        <aside class="contact-card">
          <h2>Contact on number</h2>
          <p>Prefer a call or WhatsApp? Reach the team here.</p>
          <a class="gold-btn" href="tel:+${phone}">Call ${state.contact}</a>
          <a class="ghost-btn whatsapp-btn" href="https://wa.me/${phone}" target="_blank" rel="noopener noreferrer">
            <img src="assets/whatsapp.png" alt=""> WhatsApp
          </a>
        </aside>
      </div>
    </section>
  `;
}

function bindChartControls() {
  const marketSelect = document.getElementById("chart-market");
  const dateSelect = document.getElementById("chart-date");
  const sizeSelect = document.getElementById("chart-size");

  if (marketSelect) {
    marketSelect.addEventListener("change", () => goChart(marketSelect.value));
  }

  if (dateSelect) {
    dateSelect.addEventListener("change", () => {
      state.chartDate = fromIsoDate(dateSelect.value);
      state.chartPage = 1;
      render();
    });
  }

  const clearDate = document.getElementById("chart-date-clear");
  if (clearDate) {
    clearDate.addEventListener("click", () => {
      state.chartDate = "all";
      state.chartPage = 1;
      render();
    });
  }

  if (sizeSelect) {
    sizeSelect.addEventListener("change", () => {
      state.chartPageSize = Number(sizeSelect.value);
      state.chartPage = 1;
      render();
    });
  }
}

function render() {
  parseRoute();
  setActiveNav();

  if (state.page === "chart") {
    app.innerHTML = renderChart();
    bindChartControls();
    return;
  }

  if (state.page === "leak-jodi") {
    app.innerHTML = renderLeakJodi();
    return;
  }

  if (state.page === "list-market") {
    app.innerHTML = renderListMarket();
    return;
  }

  app.innerHTML = renderMarkets();
}

app.addEventListener("click", (event) => {
  const chartBtn = event.target.closest("[data-chart]");
  if (chartBtn) {
    goChart(chartBtn.dataset.chart);
    return;
  }

  const pageBtn = event.target.closest("[data-page-number]");
  if (pageBtn && !pageBtn.disabled) {
    state.chartPage = Number(pageBtn.dataset.pageNumber);
    render();
  }
});

app.addEventListener("submit", (event) => {
  const form = event.target.closest("#market-form");
  if (!form) {
    return;
  }

  event.preventDefault();
  const data = new FormData(form);
  const phone = indiaPhone(state.contact);
  const text = encodeURIComponent(
    `GVSC market listing request\nName: ${data.get("name")}\nPhone: ${data.get("phone")}\nMarket: ${data.get("market")}\nCity: ${data.get("city") || "-"}\nMessage: ${data.get("message") || "-"}`
  );

  state.formNotice = "Request ready. Finish sending it on WhatsApp, or call the number beside the form.";
  render();
  window.open(`https://wa.me/${phone}?text=${text}`, "_blank", "noopener,noreferrer");
});

menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("is-open");
  backdrop.classList.toggle("is-open");
});

backdrop.addEventListener("click", closeSidebar);
document.querySelectorAll(".side-nav a").forEach((link) => {
  link.addEventListener("click", closeSidebar);
});

window.addEventListener("hashchange", render);

async function loadSettings() {
  try {
    const response = await fetch(SETTINGS_API, { cache: "no-store" });
    const data = await response.json();
    const settings = data.data || {};
    state.contact = settings.contact_no || settings.telegram_no || CONTACT_FALLBACK;
  } catch (error) {
    state.contact = CONTACT_FALLBACK;
  }
}

async function loadMarkets() {
  state.marketsLoading = true;
  render();

  try {
    const response = await fetch(MARKETS_API, {
      method: "GET",
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    const data = await response.json();
    const list = Array.isArray(data.data) ? data.data : [];
    state.markets = data.status !== 0 && list.length ? list : FALLBACK_MARKETS;
  } catch (error) {
    state.markets = FALLBACK_MARKETS;
  }

  state.marketsLoading = false;
  render();
}

loadSettings().then(render);
loadMarkets();
render();
