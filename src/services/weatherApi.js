import axios from "axios";

// ── Open-Meteo — 100% free, no API key ──────────────────────────────────────
const METEO_URL   = "https://api.open-meteo.com/v1/forecast";
const AQI_URL     = "https://air-quality-api.open-meteo.com/v1/air-quality";
const GEO_URL     = "https://geocoding-api.open-meteo.com/v1/search";
const NOMINATIM   = "https://nominatim.openstreetmap.org/reverse";

// WMO code → human description + icon code (matching OWM icon naming)
const WMO = {
  0:  { desc: "Clear sky",            icon: "01" },
  1:  { desc: "Mainly clear",         icon: "01" },
  2:  { desc: "Partly cloudy",        icon: "02" },
  3:  { desc: "Overcast",             icon: "04" },
  45: { desc: "Foggy",                icon: "50" },
  48: { desc: "Icy fog",              icon: "50" },
  51: { desc: "Light drizzle",        icon: "09" },
  53: { desc: "Moderate drizzle",     icon: "09" },
  55: { desc: "Dense drizzle",        icon: "09" },
  61: { desc: "Slight rain",          icon: "10" },
  63: { desc: "Moderate rain",        icon: "10" },
  65: { desc: "Heavy rain",           icon: "10" },
  71: { desc: "Slight snow",          icon: "13" },
  73: { desc: "Moderate snow",        icon: "13" },
  75: { desc: "Heavy snow",           icon: "13" },
  77: { desc: "Snow grains",          icon: "13" },
  80: { desc: "Slight showers",       icon: "09" },
  81: { desc: "Moderate showers",     icon: "09" },
  82: { desc: "Violent showers",      icon: "09" },
  85: { desc: "Snow showers",         icon: "13" },
  86: { desc: "Heavy snow showers",   icon: "13" },
  95: { desc: "Thunderstorm",         icon: "11" },
  96: { desc: "Thunderstorm w/ hail", icon: "11" },
  99: { desc: "Heavy thunderstorm",   icon: "11" },
};

// WMO → approximate OWM weather ID (used for theme selection)
const wmoToId = (code) => {
  if (code <= 1)             return 800;
  if (code === 2)            return 801;
  if (code === 3)            return 804;
  if (code === 45 || code === 48) return 741;
  if (code >= 51 && code <= 55)   return 300;
  if (code >= 61 && code <= 65)   return 500;
  if (code >= 71 && code <= 77)   return 601;
  if (code >= 80 && code <= 82)   return 520;
  if (code >= 85 && code <= 86)   return 620;
  if (code >= 95)            return 200;
  return 800;
};

const wmoIcon = (code, isDay) => {
  const base = (WMO[code] ?? WMO[0]).icon;
  return `${base}${isDay ? "d" : "n"}`;
};

// ── Geocoding ────────────────────────────────────────────────────────────────
export async function geocodeCity(city) {
  const res = await axios.get(GEO_URL, {
    params: { name: city, count: 5, language: "en", format: "json" },
  });
  return res.data?.results ?? [];
}

async function reverseGeocode(lat, lon) {
  try {
    const res = await axios.get(NOMINATIM, {
      params: { lat, lon, format: "json" },
      headers: { "Accept-Language": "en" },
    });
    const a = res.data?.address ?? {};
    return {
      name:    a.city ?? a.town ?? a.village ?? a.county ?? "Your Location",
      country: (a.country_code ?? "").toUpperCase(),
    };
  } catch {
    return { name: "Your Location", country: "" };
  }
}

// ── Core Open-Meteo fetch ─────────────────────────────────────────────────────
async function fetchFromMeteo(lat, lon, cityName, country) {
  const res = await axios.get(METEO_URL, {
    params: {
      latitude:  lat,
      longitude: lon,
      current: [
        "temperature_2m","apparent_temperature","relative_humidity_2m",
        "precipitation","weather_code","surface_pressure",
        "wind_speed_10m","wind_direction_10m","visibility","cloud_cover","is_day",
      ].join(","),
      hourly: [
        "temperature_2m","apparent_temperature",
        "precipitation_probability","weather_code","wind_speed_10m","visibility",
      ].join(","),
      daily: [
        "weather_code","temperature_2m_max","temperature_2m_min",
        "sunrise","sunset","precipitation_probability_max","wind_speed_10m_max",
      ].join(","),
      timezone:     "auto",
      forecast_days: 7,
    },
  });
  return normalise(res.data, cityName, country);
}

// ── Normalise into the shape the UI consumes ─────────────────────────────────
function normalise(raw, cityName, country) {
  const c      = raw.current;
  const isDay  = c.is_day !== 0;
  const code   = c.weather_code;
  const desc   = (WMO[code] ?? WMO[0]).desc;

  // Parse sunrise/sunset timestamps from first daily ISO string
  const sunriseTs = raw.daily?.sunrise?.[0]
    ? Math.floor(new Date(raw.daily.sunrise[0]).getTime() / 1000)
    : Math.floor(Date.now() / 1000) - 21600;
  const sunsetTs = raw.daily?.sunset?.[0]
    ? Math.floor(new Date(raw.daily.sunset[0]).getTime() / 1000)
    : Math.floor(Date.now() / 1000) + 21600;

  // Build normalised weather object
  const weather = {
    name:   cityName,
    sys:    { country, sunrise: sunriseTs, sunset: sunsetTs },
    coord:  { lat: raw.latitude, lon: raw.longitude },
    main: {
      temp:       c.temperature_2m,
      feels_like: c.apparent_temperature,
      humidity:   c.relative_humidity_2m,
      pressure:   Math.round(c.surface_pressure),
      temp_min:   raw.daily?.temperature_2m_min?.[0] ?? c.temperature_2m - 2,
      temp_max:   raw.daily?.temperature_2m_max?.[0] ?? c.temperature_2m + 2,
    },
    wind:      { speed: (c.wind_speed_10m ?? 0) / 3.6, deg: c.wind_direction_10m ?? 0 },
    visibility: c.visibility ?? 10000,
    clouds:    { all: c.cloud_cover ?? 0 },
    weather:   [{ id: wmoToId(code), main: desc, description: desc.toLowerCase(), icon: wmoIcon(code, isDay) }],
    timezone:  0,
    isDay,
  };

  // Build hourly forecast list (next 40 slots ≈ OWM style)
  const list = (raw.hourly?.time ?? []).slice(0, 1200).map((t, i) => {
    const hCode  = raw.hourly.weather_code?.[i] ?? 0;
    const hIsDay = new Date(t).getHours() >= 6 && new Date(t).getHours() < 20;
    const hDesc  = (WMO[hCode] ?? WMO[0]).desc;
    return {
      dt:     Math.floor(new Date(t).getTime() / 1000),
      dt_txt: t.replace("T", " "),
      main: {
        temp:       raw.hourly.temperature_2m?.[i]       ?? c.temperature_2m,
        feels_like: raw.hourly.apparent_temperature?.[i] ?? c.apparent_temperature,
        humidity:   c.relative_humidity_2m,
        pressure:   Math.round(c.surface_pressure),
        temp_min:   (raw.hourly.temperature_2m?.[i] ?? c.temperature_2m) - 1,
        temp_max:   (raw.hourly.temperature_2m?.[i] ?? c.temperature_2m) + 1,
      },
      weather: [{ id: wmoToId(hCode), main: hDesc, description: hDesc.toLowerCase(), icon: wmoIcon(hCode, hIsDay) }],
      wind:   { speed: (raw.hourly.wind_speed_10m?.[i] ?? 0) / 3.6, deg: c.wind_direction_10m ?? 0 },
      visibility: raw.hourly.visibility?.[i] ?? 10000,
      pop:   (raw.hourly.precipitation_probability?.[i] ?? 0) / 100,
    };
  });

  const forecast = {
    city: { name: cityName, country, timezone: 0 },
    list,
  };

  return { weather, forecast };
}

// ── AQI via Open-Meteo ────────────────────────────────────────────────────────
export async function fetchAQI(lat, lon) {
  try {
    const res = await axios.get(AQI_URL, {
      params: {
        latitude:  lat,
        longitude: lon,
        current: ["pm10","pm2_5","carbon_monoxide","nitrogen_dioxide","ozone","european_aqi"].join(","),
      },
    });
    const cur = res.data?.current ?? {};
    const rawAqi = cur.european_aqi ?? 30;
    const band   = rawAqi <= 20 ? 1 : rawAqi <= 40 ? 2 : rawAqi <= 60 ? 3 : rawAqi <= 80 ? 4 : 5;
    return {
      list: [{
        main: { aqi: band },
        components: {
          pm2_5: cur.pm2_5          ?? 0,
          pm10:  cur.pm10           ?? 0,
          o3:    cur.ozone          ?? 0,
          no2:   cur.nitrogen_dioxide ?? 0,
          co:    cur.carbon_monoxide  ?? 0,
          so2: 0, nh3: 0, no: 0,
        },
      }],
    };
  } catch {
    return FALLBACK_AQI;
  }
}

// ── Public API ────────────────────────────────────────────────────────────────
export async function fetchWeatherByCity(city) {
  const results = await geocodeCity(city);
  if (!results.length) throw new Error(`City not found: ${city}`);
  const { latitude, longitude, name, country_code } = results[0];
  const { weather } = await fetchFromMeteo(latitude, longitude, name, (country_code ?? "").toUpperCase());
  return weather;
}

export async function fetchForecastByCity(city) {
  const results = await geocodeCity(city);
  if (!results.length) throw new Error(`City not found: ${city}`);
  const { latitude, longitude, name, country_code } = results[0];
  const { forecast } = await fetchFromMeteo(latitude, longitude, name, (country_code ?? "").toUpperCase());
  return forecast;
}

export async function fetchWeatherByCoords(lat, lon) {
  const geo = await reverseGeocode(lat, lon);
  const { weather } = await fetchFromMeteo(lat, lon, geo.name, geo.country);
  return weather;
}

export async function fetchForecastByCoords(lat, lon) {
  const geo = await reverseGeocode(lat, lon);
  const { forecast } = await fetchFromMeteo(lat, lon, geo.name, geo.country);
  return forecast;
}

// ── Fallback demo data ────────────────────────────────────────────────────────
const makeFallbackHours = () =>
  Array.from({ length: 40 }, (_, i) => ({
    dt:     Math.floor(Date.now() / 1000) + i * 10800,
    dt_txt: new Date(Date.now() + i * 10800000).toISOString().replace("T", " ").slice(0, 19),
    main: {
      temp:       14 + Math.sin(i * 0.5) * 5,
      feels_like: 12 + Math.sin(i * 0.5) * 4,
      humidity:   65,
      pressure:   1013,
      temp_min:   11,
      temp_max:   18,
    },
    weather: [
      i % 10 < 3
        ? { id: 500, main: "Rain",   description: "light rain",  icon: "10d" }
        : i % 10 < 6
        ? { id: 801, main: "Clouds", description: "few clouds",  icon: "02d" }
        : { id: 800, main: "Clear",  description: "clear sky",   icon: "01d" },
    ],
    wind: { speed: 3 + Math.random() * 4, deg: 240 },
    visibility: 9000,
    pop: i % 10 < 3 ? 0.6 : 0.05,
  }));

export const FALLBACK_WEATHER = {
  name:   "London",
  sys:    { country: "GB", sunrise: Math.floor(Date.now() / 1000) - 21600, sunset: Math.floor(Date.now() / 1000) + 21600 },
  coord:  { lat: 51.5074, lon: -0.1278 },
  main:   { temp: 14, feels_like: 12, humidity: 72, pressure: 1015, temp_min: 10, temp_max: 17 },
  wind:   { speed: 4.1, deg: 240 },
  visibility: 9000,
  clouds: { all: 30 },
  weather:[{ id: 801, main: "Partly cloudy", description: "partly cloudy", icon: "02d" }],
  timezone: 0,
  isDay: true,
};

export const FALLBACK_FORECAST = {
  city: { name: "London", country: "GB", timezone: 0 },
  list: makeFallbackHours(),
};

export const FALLBACK_AQI = {
  list: [{
    main: { aqi: 2 },
    components: { pm2_5: 9.1, pm10: 15.3, o3: 62, no2: 11.2, co: 233, so2: 1.4, nh3: 0.7, no: 0.4 },
  }],
};
