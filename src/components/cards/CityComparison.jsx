import { useState } from "react";
import { GitCompare, X } from "lucide-react";
import { useWeather } from "../../context/WeatherContext";
import { formatTemp } from "../../utils/helpers";
import WeatherIcon from "../ui/WeatherIcon";

export default function CityComparison({ darkMode = true }) {
  const { weather, compareWeather, loadCompareCity, unit } = useWeather();
  const [input, setInput] = useState("");
  const [open, setOpen]   = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (input.trim()) { loadCompareCity(input.trim()); setInput(""); }
  };
  const clear = () => { loadCompareCity(null); setOpen(false); };

  const card   = darkMode ? "bg-white/10 border-white/20" : "bg-white/60 border-black/10";
  const hd     = darkMode ? "text-white/50" : "text-gray-500";
  const inp    = darkMode ? "bg-white/10 border-white/20 text-white placeholder-white/30 focus:border-white/40"
                          : "bg-black/5 border-black/15 text-gray-900 placeholder-gray-400 focus:border-black/30";
  const btnCmp = darkMode ? "bg-white/20 hover:bg-white/30 text-white" : "bg-black/15 hover:bg-black/25 text-gray-900";
  const inner  = darkMode ? "bg-white/5"    : "bg-black/5";
  const tp     = darkMode ? "text-white"    : "text-gray-900";
  const ts     = darkMode ? "text-white/60" : "text-gray-500";
  const tm     = darkMode ? "text-white/40" : "text-gray-400";
  const btnTrig = darkMode
    ? "bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-white/60 hover:text-white/80"
    : "bg-black/3 hover:bg-black/7 border-black/8 hover:border-black/15 text-gray-500 hover:text-gray-700";

  if (!open && !compareWeather) {
    return (
      <button onClick={() => setOpen(true)}
        className={`w-full flex items-center gap-2 justify-center px-4 py-3 border rounded-2xl transition-all text-sm font-body ${btnTrig}`}>
        <GitCompare className="w-4 h-4" /> Compare with another city
      </button>
    );
  }

  return (
    <div className="animate-slide-up">
      <div className={`backdrop-blur-md border rounded-3xl p-4 transition-colors duration-500 ${card}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GitCompare className={`w-4 h-4 ${hd}`} />
            <h3 className={`text-xs font-body uppercase tracking-wider ${hd}`}>City Comparison</h3>
          </div>
          <button onClick={clear}
            className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all
              ${darkMode ? "bg-white/10 hover:bg-white/20" : "bg-black/10 hover:bg-black/20"}`}>
            <X className={`w-3 h-3 ${hd}`} />
          </button>
        </div>

        {!compareWeather ? (
          <form onSubmit={submit} className="flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Enter city name…"
              className={`flex-1 border rounded-xl px-3 py-2 text-sm font-body outline-none transition-colors ${inp}`} />
            <button type="submit" className={`px-3 py-2 rounded-xl text-sm font-display transition-all ${btnCmp}`}>
              Go
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {[weather, compareWeather].map((w, i) => {
              if (!w) return null;
              return (
                <div key={i} className={`${inner} rounded-2xl p-3 text-center`}>
                  <p className={`text-xs font-body mb-2 ${ts}`}>{w.name}{w.sys?.country ? `, ${w.sys.country}` : ""}</p>
                  <WeatherIcon icon={w.weather[0].icon} size="text-3xl" />
                  <p className={`font-display font-bold text-2xl mt-1 ${tp}`}>{formatTemp(w.main.temp, unit)}</p>
                  <p className={`text-xs font-body capitalize mt-0.5 ${ts}`}>{w.weather[0].description}</p>
                  <div className="grid grid-cols-2 gap-1 mt-2">
                    {[["Humidity", `${w.main.humidity}%`], ["Wind", `${Math.round((w.wind?.speed ?? 0) * 3.6)} km/h`]].map(([k, v]) => (
                      <div key={k} className={`${inner} rounded-lg p-1.5`}>
                        <p className={`text-xs ${tm}`}>{k}</p>
                        <p className={`text-xs font-semibold font-display ${tp}`}>{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
