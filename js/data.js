const FALLBACK_MARKETS = [
  {
    market_id: "delhi-star-dl",
    market_name: "DELHI STAR-DL",
    running_status: false,
    result: "**",
    o_start_time: "10:30",
    o_end_time: "12:00",
    c_start_time: "12:10",
    c_end_time: "12:20",
    result_time: "12:30",
  },
  {
    market_id: "rawased",
    market_name: "RAWASED",
    running_status: true,
    result: "**",
    o_start_time: "11:30",
    o_end_time: "13:00",
    c_start_time: "13:10",
    c_end_time: "13:20",
    result_time: "13:30",
  },
  {
    market_id: "ilag",
    market_name: "ILAG",
    running_status: true,
    result: "**",
    o_start_time: "12:30",
    o_end_time: "14:00",
    c_start_time: "14:05",
    c_end_time: "14:12",
    result_time: "14:20",
  },
  {
    market_id: "delhi-bazaar",
    market_name: "DELHI BAZAAR",
    running_status: true,
    result: "**",
    o_start_time: "13:00",
    o_end_time: "15:00",
    c_start_time: "15:02",
    c_end_time: "15:06",
    result_time: "15:10",
  },
  {
    market_id: "shree-ganesh",
    market_name: "SHREE GANESH",
    running_status: true,
    result: "**",
    o_start_time: "14:30",
    o_end_time: "16:30",
    c_start_time: "16:32",
    c_end_time: "16:36",
    result_time: "16:40",
  },
  {
    market_id: "faridabad",
    market_name: "FARIDABAD",
    running_status: true,
    result: "157-24-689",
    o_start_time: "14:00",
    o_end_time: "17:40",
    c_start_time: "17:50",
    c_end_time: "18:00",
    result_time: "18:10",
  },
  {
    market_id: "ghaziabad",
    market_name: "GAZIABAD",
    running_status: true,
    result: "**",
    o_start_time: "18:00",
    o_end_time: "21:40",
    c_start_time: "21:45",
    c_end_time: "21:52",
    result_time: "22:00",
  },
  {
    market_id: "gali",
    market_name: "GALI",
    running_status: true,
    result: "**",
    o_start_time: "21:00",
    o_end_time: "23:40",
    c_start_time: "23:45",
    c_end_time: "23:52",
    result_time: "00:00",
  },
  {
    market_id: "ncr",
    market_name: "NCR",
    running_status: true,
    result: "**",
    o_start_time: "23:30",
    o_end_time: "01:00",
    c_start_time: "01:10",
    c_end_time: "01:20",
    result_time: "01:30",
  },
  {
    market_id: "disawar",
    market_name: "DISAWAR",
    running_status: true,
    result: "380-46-127",
    o_start_time: "03:00",
    o_end_time: "05:00",
    c_start_time: "05:02",
    c_end_time: "05:06",
    result_time: "05:10",
  },
];

const CHART_MARKETS = FALLBACK_MARKETS.map((market) => ({
  id: market.market_id,
  name: market.market_name,
}));

function pad2(value) {
  return String(value).padStart(2, "0");
}

function formatChartDate(date) {
  return `${pad2(date.getDate())}-${pad2(date.getMonth() + 1)}-${date.getFullYear()}`;
}

function seededRandom(seed) {
  let value = seed;
  return function next() {
    value = (value * 16807) % 2147483647;
    return value / 2147483647;
  };
}

function makePana(rng) {
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    .sort(() => rng() - 0.5)
    .slice(0, 3)
    .sort((a, b) => a - b);
  return digits.join("");
}

function makeJodi(rng) {
  return pad2(Math.floor(rng() * 100));
}

function buildChartResults() {
  const rows = [];
  const today = new Date(2026, 8, 18);
  let id = 1;

  for (let day = 0; day < 18; day += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - day);
    const dateLabel = formatChartDate(date);

    CHART_MARKETS.forEach((market, marketIndex) => {
      const rng = seededRandom(20260918 + day * 97 + marketIndex * 13);
      const jodi = makeJodi(rng);
      rows.push({
        id: id++,
        date: dateLabel,
        stamp: date.getTime(),
        marketId: market.id,
        marketName: market.name,
        result: `${makePana(rng)}-${jodi}-${makePana(rng)}`,
        jodi,
      });
    });
  }

  return rows;
}

const CHART_RESULTS = buildChartResults();

const LEAK_JODI = CHART_MARKETS.map((market, index) => {
  const rng = seededRandom(91001 + index * 17);
  const jodi = makeJodi(rng);
  return {
    marketId: market.id,
    marketName: market.name,
    date: "18-09-2026",
    jodi,
    openLeak: jodi[0],
    closeLeak: jodi[1],
    tag: index % 3 === 0 ? "Final" : index % 3 === 1 ? "Direct" : "Pass",
  };
});
