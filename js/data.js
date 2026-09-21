const APP_URL = "https://gvsc.myaibusiness.online/";
const TELEGRAM_URL = "https://t.me/+919988994688";
const CONTACT_FALLBACK = "9988994688";

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

const CHART_YEARS = [2026, 2025, 2024, 2023];

const MONTH_LABELS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const MARKET_HINDI = {
  "delhi-star-dl": "दिल्ली स्टार-DL",
  rawased: "रावसेद",
  ilag: "इलाग",
  "delhi-bazaar": "दिल्ली बाज़ार",
  "shree-ganesh": "श्री गणेश",
  faridabad: "फरीदाबाद",
  ghaziabad: "गाज़ियाबाद",
  gali: "गली",
  ncr: "एनसीआर",
  disawar: "दिसावर",
};

const HOME_CHART_MARKETS = CHART_MARKETS.map((market) => market.id);

const SITE_COPY = {
  ticker: "मटका गेम खेलने के लिए <b>GVSC</b> ऐप को डाउनलोड करें",
  intro:
    "दोस्तों, GVSC.com पर आपका स्वागत है। यहाँ दिल्ली स्टार, रावसेद, इलाग, दिल्ली बाज़ार, श्री गणेश, फरीदाबाद, गाज़ियाबाद, गली, एनसीआर और दिसावर समेत सभी मार्केट के सबसे तेज़ और सही रिजल्ट मिलते हैं। ताज़ा रिजल्ट, लीक जोड़ी और पुराने चार्ट एक ही जगह देखें।",
  yearIntro:
    "GVSC.com पर इस मार्केट का पूरा साल चार्ट नीचे दिया गया है। हर तारीख और हर महीने का रिजल्ट एक साथ चेक करें। पुराने रिकॉर्ड और आज का लाइव रिजल्ट यहीं उपलब्ध है।",
  about:
    "All in one Matka Result भारत की तेज़ मटका रिजल्ट साइट है। GVSC.com पर आपको हर दिन के रिजल्ट, लीक जोड़ी और सालाना रिकॉर्ड चार्ट मिलते हैं। दिल्ली स्टार, रावसेद, इलाग, दिल्ली बाज़ार, श्री गणेश, फरीदाबाद, गाज़ियाबाद, गली, एनसीआर और दिसावर जैसे मार्केट के पुराने नंबर यहीं से चेक किए जा सकते हैं। चार्ट देखकर पिछले सालों के रिजल्ट का अंदाज़ा लगाया जा सकता है। जो दोस्त गेम खेलना चाहते हैं, वे GVSC ऐप खोलकर या डाउनलोड करके खेल सकते हैं। यह वेबसाइट जानकारी और चार्ट के लिए है। अपना मार्केट लिस्ट करवाने के लिए साइट पर दिए फॉर्म से संपर्क करें।",
  appHindi: "गेम खेलना चाहते हैं? यहाँ टैप करें — GVSC ऐप खोलें या डाउनलोड करें।",
  appEnglish: "Play or download the GVSC app",
  formHindi: "अपना मार्केट लिस्ट करें",
  formEnglish: "List your market",
  footerAbout:
    "GVSC.com पर आपका स्वागत है। हमारी वेबसाइट सबसे तेज़ मटका रिजल्ट साइटों में से एक है। 2018 से हम दिल्ली स्टार, रावसेद, इलाग, दिल्ली बाज़ार, श्री गणेश, फरीदाबाद, गाज़ियाबाद, गली, एनसीआर और दिसावर के रिजल्ट और चार्ट दिखा रहे हैं। पुराने रिकॉर्ड देखकर पिछले नंबरों का अंदाज़ा लगाया जा सकता है। गेम खेलने के लिए GVSC ऐप खोलें या डाउनलोड करें। अपना मार्केट लिस्ट करवाने के लिए फॉर्म से संपर्क करें।",
  footerEnglish:
    "All in one Matka Result is a popular live result board for markets such as Disawar, Gali, Faridabad, Gaziabad, Shree Ganesh and Delhi Bazaar. People check these charts every day across many parts of India. You can review old records here, and if you want to play you can open or download the GVSC app.",
  privacy:
    "GVSC.com केवल रिजल्ट और चार्ट की जानकारी दिखाता है। हम आपका फ़ोन नंबर या फॉर्म डेटा मार्केट लिस्टिंग के लिए ही इस्तेमाल करते हैं।",
  disclaimer:
    "यह वेबसाइट जानकारी और पुराने चार्ट के लिए है। गेम खेलना है तो GVSC ऐप का उपयोग करें। नतीजे समय के साथ अपडेट होते रहते हैं।",
};

function pad2(value) {
  return String(value).padStart(2, "0");
}

function hashSeed(year, monthIndex, day, marketIndex) {
  let hash = 2166136261;
  const parts = [year, monthIndex + 31, day + 17, marketIndex + 11, year * (day + 3)];
  parts.forEach((part) => {
    hash ^= part;
    hash = Math.imul(hash, 16777619);
  });
  return (hash >>> 0) % 2147483646 + 1;
}

function seededRandom(seed) {
  let value = seed % 2147483647;
  if (value <= 0) {
    value += 2147483646;
  }
  value = (value * 16807) % 2147483647;
  value = (value * 16807) % 2147483647;
  return function next() {
    value = (value * 16807) % 2147483647;
    return value / 2147483647;
  };
}

function makeJodi(rng) {
  return pad2(Math.floor(rng() * 100));
}

function istParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    weekday: "short",
  }).formatToParts(date);
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: map.hour,
    minute: map.minute,
    dayPeriod: (map.dayPeriod || "").toUpperCase(),
  };
}

function formatIndiaDateTime(date = new Date()) {
  const parts = istParts(date);
  const monthName = new Intl.DateTimeFormat("en-IN", {
    month: "long",
    timeZone: "Asia/Kolkata",
  }).format(date);
  return `${parts.day} ${monthName} ${parts.year}, ${parts.hour}:${parts.minute} ${parts.dayPeriod}`;
}

function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function compareDate(year, monthIndex, day, today) {
  const left = year * 10000 + (monthIndex + 1) * 100 + day;
  const right = today.year * 10000 + today.month * 100 + today.day;
  return left - right;
}

function mockJodi(marketIndex, year, monthIndex, day) {
  const rng = seededRandom(hashSeed(year, monthIndex, day, marketIndex));
  return makeJodi(rng);
}

function chartCell(marketIndex, year, monthIndex, day, liveValue) {
  const today = istParts();
  if (day > daysInMonth(year, monthIndex)) {
    return "";
  }

  const diff = compareDate(year, monthIndex, day, today);
  if (diff > 0) {
    return "-";
  }
  if (diff === 0) {
    return liveValue && liveValue !== "**" ? liveValue : "**";
  }
  return mockJodi(marketIndex, year, monthIndex, day);
}

const LEAK_JODI = CHART_MARKETS.map((market, index) => {
  const rng = seededRandom(91001 + index * 17);
  const jodi = makeJodi(rng);
  return {
    marketId: market.id,
    marketName: market.name,
    date: "19-09-2026",
    jodi,
    openLeak: jodi[0],
    closeLeak: jodi[1],
    tag: index % 3 === 0 ? "Final" : index % 3 === 1 ? "Direct" : "Pass",
  };
});
