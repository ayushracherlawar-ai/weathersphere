import { Heart, MapPin, RefreshCw, Share2 } from "lucide-react";
import { useWeather } from "../../context/WeatherContext";
import { formatTemp, windDirection } from "../../utils/helpers";
import WeatherIcon from "../ui/WeatherIcon";
import SunriseSunset from "./SunriseSunset";

export default function WeatherCard({ darkMode = true }) {
  const { weather, unit, favCities, toggleFav, loadWeatherData } = useWeather();
  if (!weather) return null;

  const { name, sys, main, wind, visibility, weather: cond } = weather;
  const isFav = favCities.includes(name);

  // Theme tokens
  const card  = darkMode ? "bg-white/10 border-white/20" : "bg-white/60 border-black/10";
  const inner = darkMode ? "bg-white/5 hover:bg-white/10" : "bg-black/5 hover:bg-black/8";
  const tp    = darkMode ? "text-white"    : "text-gray-900";
  const ts    = darkMode ? "text-white/70" : "text-gray-600";
  const tm    = darkMode ? "text-white/45" : "text-gray-400";
  const btn   = darkMode ? "bg-white/10 hover:bg-white/20" : "bg-black/10 hover:bg-black/20";

  const stats = [
    { label: "Feels Like",  value: formatTemp(main.feels_like, unit), icon: "🌡️" },
    { label: "Humidity",    value: `${main.humidity}%`,               icon: "💧" },
    { label: "Wind",        value: `${Math.round((wind.speed ?? 0) * 3.6)} km/h ${windDirection(wind.deg)}`, icon: "💨" },
    { label: "Visibility",  value: `${((visibility ?? 10000) / 1000).toFixed(1)} km`, icon: "👁️" },
    { label: "Pressure",    value: `${main.pressure} hPa`,            icon: "🔄" },
    { label: "Cloud Cover", value: `${weather.clouds?.all ?? 0}%`,    icon: "☁️" },
  ];

  const handleShare = async () => {
    const text = `${name}: ${formatTemp(main.temp, unit)} — ${cond[0].description}`;
    if (navigator.share) { await navigator.share({ title: "WeatherSphere", text }); }
    else { navigator.clipboard?.writeText(text); }
  };

  return (
    <div className="animate-slide-up">
      <div className={`rounded-3xl backdrop-blur-md border p-6 md:p-8 transition-colors duration-500 ${card}`}>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className={`flex items-center gap-1.5 text-sm font-body mb-0.5 ${ts}`}>
              <MapPin className="w-3.5 h-3.5" />
              <span>{name}{sys.country ? `, ${sys.country}` : ""}</span>
            </div>
            <p className={`text-xs font-body ${tm}`}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => loadWeatherData(name)} aria-label="Refresh"
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${btn} ${ts}`}>
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button onClick={handleShare} aria-label="Share"
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${btn} ${ts}`}>
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => toggleFav(name)} aria-label={isFav ? "Remove favourite" : "Add favourite"} aria-pressed={isFav}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all
                ${isFav ? "bg-red-400/30 hover:bg-red-400/40" : btn}`}>
              <Heart className={`w-3.5 h-3.5 ${isFav ? "text-red-400 fill-red-400" : ts}`} />
            </button>
          </div>
        </div>

        {/* Temperature hero */}
        <div className="flex items-center gap-6 mb-6">
          <div>
            <div className={`text-7xl md:text-8xl font-display font-bold leading-none tracking-tighter ${tp}`}>
              {formatTemp(main.temp, unit).replace("°C","").replace("°F","")}
              <span className="text-4xl md:text-5xl font-light">{unit === "C" ? "°C" : "°F"}</span>
            </div>
            <p className={`text-lg font-body mt-1 capitalize ${ts}`}>{cond[0].description}</p>
            <p className={`text-sm font-body ${tm}`}>
              H: {formatTemp(main.temp_max, unit)} · L: {formatTemp(main.temp_min, unit)}
            </p>
          </div>
          <WeatherIcon icon={cond[0].icon} size="text-7xl md:text-8xl" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {stats.map(({ label, value, icon }) => (
            <div key={label} className={`rounded-2xl p-3 transition-colors cursor-default ${inner}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">{icon}</span>
                <span className={`text-xs font-body ${tm}`}>{label}</span>
              </div>
              <span className={`font-display font-semibold text-sm ${tp}`}>{value}</span>
            </div>
          ))}
        </div>

        {/* Sunrise/Sunset */}
        <div className="mt-4">
          <SunriseSunset sunrise={sys.sunrise} sunset={sys.sunset} darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
}
