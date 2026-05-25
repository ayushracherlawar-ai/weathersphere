import { useState, useRef, useEffect } from "react";
import { Search, Clock, X, Loader2, MapPin } from "lucide-react";
import { useWeather } from "../../context/WeatherContext";
import { geocodeCity } from "../../services/weatherApi";
import { useDebounce } from "../../hooks/useDebounce";

export default function SearchBar({ darkMode = true }) {
  const { loadWeatherData, recentSearches, clearRecent } = useWeather();

  const [query,       setQuery]       = useState("");
  const [focused,     setFocused]     = useState(false);
  const [searching,   setSearching]   = useState(false); // spinner while loading weather
  const [suggesting,  setSuggesting]  = useState(false); // spinner while fetching suggestions
  const [suggestions, setSuggestions] = useState([]);    // geocoding results

  const inputRef   = useRef(null);
  const debouncedQ = useDebounce(query, 350); // wait 350 ms after user stops typing

  // ── Fetch city suggestions from Open-Meteo geocoding API ─────────────────
  useEffect(() => {
    // Need at least 2 chars to get useful suggestions
    if (debouncedQ.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;
    setSuggesting(true);

    geocodeCity(debouncedQ)
      .then((results) => {
        if (!cancelled) setSuggestions(results.slice(0, 6));
      })
      .catch(() => {
        if (!cancelled) setSuggestions([]);
      })
      .finally(() => {
        if (!cancelled) setSuggesting(false);
      });

    // Cleanup: ignore stale response if query changed before it resolved
    return () => { cancelled = true; };
  }, [debouncedQ]);

  // ── Load weather when user picks a city ──────────────────────────────────
  const search = async (cityName) => {
    if (!cityName.trim()) return;
    setSearching(true);
    setSuggestions([]);
    setQuery("");
    setFocused(false);
    inputRef.current?.blur();
    await loadWeatherData(cityName.trim());
    setSearching(false);
  };

  const onKey = (e) => {
    if (e.key === "Enter")  search(query);
    if (e.key === "Escape") {
      setFocused(false);
      setQuery("");
      setSuggestions([]);
    }
  };

  // Show dropdown if focused AND there is anything to show
  const showDrop = focused && (
    suggestions.length > 0 ||
    recentSearches.length > 0 ||
    query.length > 1
  );

  // ── Colour tokens (dark vs light mode) ───────────────────────────────────
  const ring = focused
    ? (darkMode ? "bg-white/20 ring-2 ring-white/40"  : "bg-black/10 ring-2 ring-black/20")
    : (darkMode ? "bg-white/10 hover:bg-white/15"     : "bg-black/5  hover:bg-black/10");

  const ic   = darkMode ? "text-white/60"                      : "text-gray-500";
  const inp  = darkMode ? "text-white placeholder-white/40"    : "text-gray-800 placeholder-gray-400";
  const drop = darkMode ? "bg-gray-900/95 border-white/10"     : "bg-white border-black/10";
  const row  = darkMode ? "text-white hover:bg-white/10"        : "text-gray-800 hover:bg-gray-100";
  const lbl  = darkMode ? "text-white/30"                       : "text-gray-400";
  const sub  = darkMode ? "text-white/40"                       : "text-gray-400";
  const divider = darkMode ? "border-white/10"                  : "border-black/6";

  return (
    <div className="relative w-full max-w-md" role="search">

      {/* ── Input box ──────────────────────────────────────────────────────── */}
      <div className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl backdrop-blur-md transition-all duration-300 ${ring}`}>

        {/* Left icon: big spinner when loading weather, else search icon */}
        {searching
          ? <Loader2 className={`w-4 h-4 animate-spin-loader flex-shrink-0 ${ic}`} />
          : <Search  className={`w-4 h-4 flex-shrink-0 ${ic}`} />
        }

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 180)}
          onKeyDown={onKey}
          placeholder="Search city…"
          className={`flex-1 bg-transparent outline-none text-sm font-body ${inp}`}
          aria-label="Search for a city"
          aria-autocomplete="list"
          aria-expanded={showDrop}
          autoComplete="off"
          spellCheck="false"
        />

        {/* Right side: tiny spinner while fetching suggestions OR clear button */}
        {suggesting && (
          <Loader2 className={`w-3 h-3 animate-spin-loader flex-shrink-0 opacity-50 ${ic}`} />
        )}
        {query && !suggesting && (
          <button
            onClick={() => { setQuery(""); setSuggestions([]); inputRef.current?.focus(); }}
            className={`${ic} hover:opacity-80 transition-opacity flex-shrink-0`}
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Dropdown ───────────────────────────────────────────────────────── */}
      {showDrop && (
        <div
          className={`absolute top-full mt-2 w-full rounded-2xl overflow-hidden backdrop-blur-xl border shadow-2xl z-50 animate-fade-in ${drop}`}
          role="listbox"
        >

          {/* Section 1: Live city suggestions from geocoding API */}
          {suggestions.length > 0 && (
            <>
              <div className={`px-4 py-2 border-b ${divider}`}>
                <span className={`text-xs uppercase tracking-wider font-body ${lbl}`}>
                  Suggestions
                </span>
              </div>

              {suggestions.map((s) => (
                <button
                  key={`${s.latitude}-${s.longitude}`}
                  onMouseDown={() => search(s.name)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${row}`}
                  role="option"
                >
                  <MapPin className="w-4 h-4 opacity-40 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    {/* City name */}
                    <span className="text-sm font-body font-medium block truncate">
                      {s.name}
                    </span>
                    {/* State + Country below */}
                    {(s.admin1 || s.country) && (
                      <span className={`text-xs font-body block truncate ${sub}`}>
                        {[s.admin1, s.country].filter(Boolean).join(", ")}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </>
          )}

          {/* Section 2: Plain "search for X" row — shown while suggestions load */}
          {suggestions.length === 0 && query.length > 1 && (
            <button
              className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-body transition-colors ${row}`}
              onMouseDown={() => search(query)}
            >
              <Search className="w-4 h-4 opacity-40 flex-shrink-0" />
              <span>
                Search "<span className="font-semibold">{query}</span>"
              </span>
            </button>
          )}

          {/* Section 3: Recent searches */}
          {recentSearches.length > 0 && (
            <>
              <div className={`flex items-center justify-between px-4 py-2 border-t ${divider}`}>
                <span className={`text-xs uppercase tracking-wider font-body ${lbl}`}>
                  Recent
                </span>
                <button
                  onClick={clearRecent}
                  className={`text-xs font-body hover:opacity-70 transition-opacity ${lbl}`}
                >
                  Clear
                </button>
              </div>

              {recentSearches.slice(0, 5).map((city) => (
                <button
                  key={city}
                  onMouseDown={() => search(city)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-body transition-colors ${row}`}
                >
                  <Clock className="w-4 h-4 opacity-40 flex-shrink-0" />
                  <span>{city}</span>
                </button>
              ))}
            </>
          )}

        </div>
      )}
    </div>
  );
}