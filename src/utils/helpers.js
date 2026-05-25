// ── Temperature ──────────────────────────────────────────────────────────────
export const celsiusToFahrenheit = (c) => Math.round((c * 9) / 5 + 32);
export const formatTemp = (temp, unit) =>
  unit === "F" ? `${celsiusToFahrenheit(temp)}°F` : `${Math.round(temp)}°C`;

// ── Time ─────────────────────────────────────────────────────────────────────
export const formatHour = (dt) => {
  const d = typeof dt === "number" ? new Date(dt * 1000) : new Date(dt);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const getDayName = (dtStr) => {
  const d = new Date(dtStr);
  return d.toLocaleDateString("en-US", { weekday: "long" });
};

export const isNight = (dt, sunrise, sunset) =>
  dt < sunrise || dt > sunset;

// ── Wind direction ────────────────────────────────────────────────────────────
export const windDirection = (deg) => {
  const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  return dirs[Math.round((deg ?? 0) / 22.5) % 16];
};

// ── Weather theme (dark + light gradients, particle type) ────────────────────
const THEMES = {
  clear:  {
    dark:  "from-[#0369a1] via-[#0284c7] to-[#0ea5e9]",
    light: "from-[#7dd3fc] via-[#bae6fd] to-[#e0f2fe]",
    particle: "sunny",
  },
  rain: {
    dark:  "from-[#1e3a5f] via-[#1e40af] to-[#1d4ed8]",
    light: "from-[#93c5fd] via-[#bfdbfe] to-[#dbeafe]",
    particle: "rain",
  },
  snow: {
    dark:  "from-[#1e293b] via-[#334155] to-[#475569]",
    light: "from-[#cbd5e1] via-[#e2e8f0] to-[#f1f5f9]",
    particle: "snow",
  },
  cloudy: {
    dark:  "from-[#1f2937] via-[#374151] to-[#4b5563]",
    light: "from-[#9ca3af] via-[#d1d5db] to-[#e5e7eb]",
    particle: "clouds",
  },
  fog: {
    dark:  "from-[#1f2937] via-[#374151] to-[#6b7280]",
    light: "from-[#9ca3af] via-[#d1d5db] to-[#f3f4f6]",
    particle: "fog",
  },
  thunder: {
    dark:  "from-[#0f172a] via-[#1e1b4b] to-[#312e81]",
    light: "from-[#a5b4fc] via-[#c7d2fe] to-[#e0e7ff]",
    particle: "rain",
  },
  night: {
    dark:  "from-[#020617] via-[#0f172a] to-[#1e1b4b]",
    light: "from-[#c7d2fe] via-[#ddd6fe] to-[#ede9fe]",
    particle: "stars",
  },
};

export const getTheme = (weatherId, nightTime) => {
  let name = "clear";
  if (nightTime)                              name = "night";
  else if (weatherId >= 200 && weatherId < 300) name = "thunder";
  else if (weatherId >= 300 && weatherId < 600) name = "rain";
  else if (weatherId >= 600 && weatherId < 700) name = "snow";
  else if (weatherId >= 700 && weatherId < 800) name = "fog";
  else if (weatherId === 800)                   name = "clear";
  else if (weatherId > 800)                     name = "cloudy";
  return THEMES[name];
};

// ── AQI ───────────────────────────────────────────────────────────────────────
export const AQI_LEVELS = [
  { label: "Good",      color: "#22c55e", desc: "Air quality is satisfactory" },
  { label: "Fair",      color: "#84cc16", desc: "Acceptable quality" },
  { label: "Moderate",  color: "#eab308", desc: "Sensitive groups may be affected" },
  { label: "Poor",      color: "#f97316", desc: "Everyone may feel effects" },
  { label: "Very Poor", color: "#ef4444", desc: "Health warnings issued" },
];
export const getAQIInfo = (aqi) =>
  AQI_LEVELS[Math.min((aqi ?? 1) - 1, AQI_LEVELS.length - 1)] ?? AQI_LEVELS[0];

// ── Weather insights ──────────────────────────────────────────────────────────
export const generateInsights = (weather) => {
  const out = [];
  const { main, wind, weather: cond, visibility } = weather;
  const id  = cond[0]?.id ?? 800;
  const spd = (wind?.speed ?? 0) * 3.6; // m/s → km/h

  if (id >= 300 && id < 600) out.push({ icon: "☂️", text: "Carry an umbrella today",              type: "warning"  });
  if (id >= 200 && id < 300) out.push({ icon: "⚡", text: "Thunderstorm — avoid open areas",      type: "alert"    });
  if (id >= 600 && id < 700) out.push({ icon: "❄️", text: "Snowfall expected — roads may be icy", type: "warning"  });
  if (id === 800 && main.temp > 14 && main.temp < 28)
                             out.push({ icon: "🌳", text: "Perfect weather for outdoor activities!", type: "positive" });
  if (main.temp > 35)        out.push({ icon: "🌡️", text: "Extreme heat — stay hydrated",          type: "alert"    });
  if (main.temp < 5)         out.push({ icon: "🧥", text: "Bundle up — it's freezing!",            type: "warning"  });
  if (main.humidity > 75)    out.push({ icon: "💧", text: "High humidity may feel uncomfortable",   type: "info"     });
  if (spd > 40)              out.push({ icon: "💨", text: "Strong winds — secure loose items",     type: "warning"  });
  if ((visibility ?? 10000) < 2000)
                             out.push({ icon: "🌫️", text: "Low visibility — drive carefully",     type: "warning"  });
  if (out.length === 0)      out.push({ icon: "✨", text: "All clear — enjoy your day!",           type: "positive" });
  return out;
};

// ── Group hourly list → daily ─────────────────────────────────────────────────
export const groupForecastByDay = (list) => {
  const days = {};
  list.forEach((item) => {
    const day = (item.dt_txt ?? "").split(" ")[0] || new Date(item.dt * 1000).toISOString().split("T")[0];
    if (!days[day]) days[day] = [];
    days[day].push(item);
  });
  const entries = Object.entries(days);
  const start = entries.length >= 6 ? 1 : 0;   // skip partial today if we have enough days
  return entries.slice(start, start + 5).map(([date, items]) => ({
    date,
    items,
    maxTemp: Math.max(...items.map((i) => i.main.temp)),
    minTemp: Math.min(...items.map((i) => i.main.temp)),
    condition: items[Math.floor(items.length / 2)].weather[0],
    pop: Math.max(...items.map((i) => i.pop ?? 0)),
  }));
};
