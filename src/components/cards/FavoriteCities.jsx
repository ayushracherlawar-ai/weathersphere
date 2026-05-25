import { Heart, X } from "lucide-react";
import { useWeather } from "../../context/WeatherContext";

export default function FavoriteCities({ darkMode = true }) {
  const { favCities, toggleFav, loadWeatherData, weather } = useWeather();

  const card  = darkMode ? "bg-white/10 border-white/20" : "bg-white/60 border-black/10";
  const hd    = darkMode ? "text-white/50" : "text-gray-500";
  const empty = darkMode ? "text-white/35" : "text-gray-400";
  const activePill  = darkMode ? "bg-white/20 border-white/30 text-white" : "bg-black/15 border-black/20 text-gray-900";
  const defaultPill = darkMode ? "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                               : "bg-black/5 border-black/8 text-gray-600 hover:bg-black/10 hover:text-gray-900";

  return (
    <div className="animate-slide-up">
      <div className={`backdrop-blur-md border rounded-3xl p-4 transition-colors duration-500 ${card}`}>
        <div className="flex items-center gap-2 mb-3">
          {favCities.length > 0
            ? <Heart className="w-4 h-4 text-red-400 fill-red-400" />
            : <Heart className={`w-4 h-4 ${hd}`} />
          }
          <h3 className={`text-xs font-body uppercase tracking-wider ${hd}`}>Saved Cities</h3>
        </div>

        {favCities.length === 0 ? (
          <div className="text-center py-4">
            <div className="text-3xl mb-2">🏙️</div>
            <p className={`text-sm font-body ${empty}`}>Save cities by tapping the ❤️ icon</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {favCities.map((city) => (
              <div key={city} className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all
                ${weather?.name === city ? activePill : defaultPill}`}>
                <button className="text-sm font-body" onClick={() => loadWeatherData(city)}>{city}</button>
                <button
                  onClick={() => toggleFav(city)}
                  className="w-4 h-4 rounded-full bg-white/10 hover:bg-red-400/30 flex items-center justify-center
                    opacity-0 group-hover:opacity-100 transition-all"
                  aria-label={`Remove ${city}`}>
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
