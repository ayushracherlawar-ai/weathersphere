import { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  fetchWeatherByCity, fetchWeatherByCoords,
  fetchForecastByCity, fetchForecastByCoords,
  fetchAQI,
} from "../services/weatherApi";

const WeatherContext = createContext(null);

const lsGet = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; }
  catch { return fallback; }
};
const lsSet = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

export function WeatherProvider({ children }) {
  const [weather,  setWeather]  = useState(null);
  const [forecast, setForecast] = useState(null);
  const [aqi,      setAqi]      = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [unit,     setUnit]     = useState(() => lsGet("unit", "C"));

  // ── Dark mode: default true, persisted ──────────────────────────────────
  const [darkMode, setDarkModeState] = useState(() => lsGet("darkMode", true));

  useEffect(() => {
    lsSet("darkMode", darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleDark = useCallback(() => setDarkModeState((d) => !d), []);

  useEffect(() => { lsSet("unit", unit); }, [unit]);

  // ── Favourites & recents ─────────────────────────────────────────────────
  const [favCities,     setFavCities]     = useState(() => lsGet("favCities", []));
  const [recentSearches, setRecentSearches] = useState(() => lsGet("recentSearches", []));

  const toggleFav = useCallback((city) => {
    setFavCities((prev) => {
      const next = prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city];
      lsSet("favCities", next);
      return next;
    });
  }, []);

  const clearRecent = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  }, []);

  // ── Compare city ─────────────────────────────────────────────────────────
  const [compareWeather,  setCompareWeather]  = useState(null);
  const [compareForecast, setCompareForecast] = useState(null);

  // ── Core data loader ─────────────────────────────────────────────────────
  const _load = useCallback(async (wPromise, fPromise, cityName) => {
    setLoading(true);
    setError(null);
    try {
      const [w, f] = await Promise.all([wPromise, fPromise]);
      setWeather(w);
      setForecast(f);
      const aqiData = await fetchAQI(w.coord.lat, w.coord.lon);
      setAqi(aqiData);
      if (cityName) {
        setRecentSearches((prev) => {
          const next = [cityName, ...prev.filter((c) => c.toLowerCase() !== cityName.toLowerCase())].slice(0, 8);
          lsSet("recentSearches", next);
          return next;
        });
      }
    } catch {
      setError("Could not load weather data — showing demo data.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadWeatherData = useCallback((city) =>
    _load(fetchWeatherByCity(city), fetchForecastByCity(city), city), [_load]);

  const loadByCoords = useCallback((lat, lon) =>
    _load(fetchWeatherByCoords(lat, lon), fetchForecastByCoords(lat, lon), null), [_load]);

  const loadCompareCity = useCallback(async (city) => {
    if (!city) { setCompareWeather(null); setCompareForecast(null); return; }
    try {
      const [w, f] = await Promise.all([fetchWeatherByCity(city), fetchForecastByCity(city)]);
      setCompareWeather(w);
      setCompareForecast(f);
    } catch { /* silent */ }
  }, []);

  return (
    <WeatherContext.Provider value={{
      weather, forecast, aqi, loading, error,
      unit, setUnit,
      darkMode, toggleDark,
      favCities, toggleFav,
      recentSearches, clearRecent,
      loadWeatherData, loadByCoords,
      compareWeather, compareForecast, loadCompareCity,
    }}>
      {children}
    </WeatherContext.Provider>
  );
}

export const useWeather = () => {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error("useWeather must be inside WeatherProvider");
  return ctx;
};
