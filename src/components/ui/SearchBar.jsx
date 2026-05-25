import { useState, useRef } from "react";
import { Search, Clock, X, Loader2 } from "lucide-react";
import { useWeather } from "../../context/WeatherContext";

export default function SearchBar({ darkMode = true }) {
  const { loadWeatherData, recentSearches, clearRecent } = useWeather();
  const [query,   setQuery]   = useState("");
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const search = async (city) => {
    if (!city.trim()) return;
    setLoading(true);
    await loadWeatherData(city.trim());
    setLoading(false);
    setQuery(""); setFocused(false);
    inputRef.current?.blur();
  };

  const onKey = (e) => {
    if (e.key === "Enter")  search(query);
    if (e.key === "Escape") { setFocused(false); setQuery(""); }
  };

  const showDrop = focused && (query.length > 0 || recentSearches.length > 0);

  // Colour tokens
  const ring   = focused ? (darkMode ? "bg-white/20 ring-2 ring-white/40" : "bg-black/10 ring-2 ring-black/20")
                         : (darkMode ? "bg-white/10 hover:bg-white/15"     : "bg-black/5 hover:bg-black/10");
  const ic     = darkMode ? "text-white/60"  : "text-gray-500";
  const inp    = darkMode ? "text-white placeholder-white/40"   : "text-gray-800 placeholder-gray-400";
  const drop   = darkMode ? "bg-gray-900/90 border-white/10"   : "bg-white/95 border-black/10";
  const row    = darkMode ? "text-white hover:bg-white/10"      : "text-gray-800 hover:bg-black/5";
  const lbl    = darkMode ? "text-white/30"  : "text-gray-400";

  return (
    <div className="relative w-full max-w-md" role="search">
      {/* Input */}
      <div className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl backdrop-blur-md transition-all duration-300 ${ring}`}>
        {loading
          ? <Loader2 className={`w-4 h-4 animate-spin-loader flex-shrink-0 ${ic}`} />
          : <Search  className={`w-4 h-4 flex-shrink-0 ${ic}`} />
        }
        <input ref={inputRef} type="text" value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 160)}
          onKeyDown={onKey}
          placeholder="Search city…"
          className={`flex-1 bg-transparent outline-none text-sm font-body ${inp}`}
          aria-label="Search for a city"
        />
        {query && (
          <button onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className={`${ic} hover:opacity-80 transition-opacity`} aria-label="Clear">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDrop && (
        <div className={`absolute top-full mt-2 w-full rounded-2xl overflow-hidden backdrop-blur-xl border shadow-2xl z-50 animate-fade-in ${drop}`}>
          {query.length > 1 && (
            <button className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-body transition-colors ${row}`}
              onMouseDown={() => search(query)}>
              <Search className="w-4 h-4 opacity-40" />
              Search for "<span className="font-semibold">{query}</span>"
            </button>
          )}
          {recentSearches.length > 0 && (
            <>
              <div className={`flex items-center justify-between px-4 py-2 border-t ${darkMode ? "border-white/10" : "border-black/5"}`}>
                <span className={`text-xs uppercase tracking-wider font-body ${lbl}`}>Recent</span>
                <button onClick={clearRecent} className={`text-xs font-body ${lbl} hover:opacity-70 transition-opacity`}>Clear</button>
              </div>
              {recentSearches.slice(0, 6).map((city) => (
                <button key={city} onMouseDown={() => search(city)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-body transition-colors ${row}`}>
                  <Clock className="w-4 h-4 opacity-40" />
                  {city}
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
