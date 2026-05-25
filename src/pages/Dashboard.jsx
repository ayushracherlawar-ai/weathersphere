import { useWeather } from "../context/WeatherContext";
import { useGeolocation } from "../hooks/useGeolocation";
import { getTheme, isNight } from "../utils/helpers";

import WeatherBackground   from "../components/effects/WeatherBackground";
import SearchBar           from "../components/ui/SearchBar";
import ThemeToggle         from "../components/ui/ThemeToggle";
import UnitToggle          from "../components/ui/UnitToggle";
import { WeatherSkeleton } from "../components/ui/Skeleton";
import LoadingScreen       from "../components/ui/LoadingScreen";
import ErrorState          from "../components/ui/ErrorState";

import WeatherCard         from "../components/cards/WeatherCard";
import { HourlyForecast, DailyForecast } from "../components/cards/ForecastCard";
import AQICard             from "../components/cards/AQICard";
import WeatherInsights     from "../components/cards/WeatherInsights";
import FavoriteCities      from "../components/cards/FavoriteCities";
import CityComparison      from "../components/cards/CityComparison";
import TechHighlights      from "../components/cards/TechHighlights";
import WeatherChart        from "../components/charts/WeatherChart";

export default function Dashboard() {
  useGeolocation("Nagpur");

  const { weather, loading, error, loadWeatherData, darkMode } = useWeather();

  // Resolve theme
  const weatherId  = weather?.weather?.[0]?.id ?? 800;
  const nightTime  = weather
    ? isNight(Math.floor(Date.now() / 1000), weather.sys.sunrise, weather.sys.sunset)
    : false;
  const theme      = getTheme(weatherId, nightTime) ?? getTheme(800, false);
  const gradient   = darkMode ? theme.dark : theme.light;
  const particle   = darkMode ? theme.particle : "none";

  // Shared colour tokens
  const dm = darkMode;

  if (loading && !weather) return <LoadingScreen />;

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${gradient} transition-all duration-700`}
      style={{ backgroundSize: "200% 200%", animation: "gradientShift 14s ease infinite" }}
    >
      {/* Particle effects */}
      <WeatherBackground particleType={particle} />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-500
          ${dm ? "bg-black/20 border-white/10" : "bg-white/60 border-black/10"}`}>
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
            {/* Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xl">🌤️</span>
              <span className={`font-display font-bold text-lg hidden sm:block transition-colors duration-500
                ${dm ? "text-white" : "text-gray-900"}`}>
                WeatherSphere
              </span>
            </div>

            {/* Search */}
            <div className="flex-1">
              <SearchBar darkMode={dm} />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <UnitToggle  darkMode={dm} />
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 space-y-4">
          {error && (
            <ErrorState message={error} darkMode={dm}
              onRetry={() => weather && loadWeatherData(weather.name)} />
          )}

          {loading && weather ? (
            <div className="opacity-40 pointer-events-none">
              <WeatherSkeleton />
            </div>
          ) : (
            <>
              <WeatherCard      darkMode={dm} />
              <WeatherInsights  darkMode={dm} />
              <HourlyForecast   darkMode={dm} />
              <WeatherChart     darkMode={dm} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DailyForecast  darkMode={dm} />
                <AQICard        darkMode={dm} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FavoriteCities darkMode={dm} />
                <CityComparison darkMode={dm} />
              </div>
              <TechHighlights   darkMode={dm} />
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-auto py-4 px-6 text-center">
          <p className={`text-center py-4 text-xs font-body transition-colors duration-500
          ${dm ? "text-white/25" : "text-gray-400"}`}>
          Powered by Open-Meteo · Build with React + Vite + Tailwind
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-600">
            © 2026 WeatherSphere. All Rights Reserved by{" "}
            <span className="text-brand-500 font-medium">Ayush Racherlawar</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
